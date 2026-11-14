import os
import uuid
from datetime import date
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.customer import Customer
from app.models.dropshipping_entry import DropshippingEntry
from app.models.user import User
from app.schemas.dropshipping import DropshippingEntryOut

router = APIRouter(prefix="/dropshipping", tags=["Dropshipping (Customer)"])

# Persistent disk on Render (same place as the other uploads)
UPLOAD_DIR = os.getenv(
    "DROPSHIPPING_UPLOAD_DIR",
    "/opt/render/project/src/backend/uploads/dropshipping",
)
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_EXCEL_BYTES = 10 * 1024 * 1024    # 10 MB
MAX_LABELS_BYTES = 25 * 1024 * 1024   # 25 MB
CHUNK_SIZE = 1024 * 1024              # 1 MB

# First bytes of the real file formats, so a renamed file is rejected
XLSX_SIGNATURE = b"PK\x03\x04"                       # .xlsx is a zip file
XLS_SIGNATURE = bytes.fromhex("D0CF11E0A1B11AE1")    # .xls (old OLE format)
PDF_SIGNATURE = b"%PDF"

MEDIA_TYPES = {
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls": "application/vnd.ms-excel",
    ".pdf": "application/pdf",
}


# ---------------------------------------------------------------- helpers

def _require_dropshipping_customer(db: Session, user: User) -> Customer:
    """Only customer logins whose customer is on the Dropshipping model."""
    if user.role != "customer" or not user.customer_id:
        raise HTTPException(status_code=403, detail="Only customers can use Dropshipping Inventory")

    customer = db.query(Customer).filter(
        Customer.id == user.customer_id,
        Customer.company_id == user.company_id,
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if customer.business_model != "dropshipping":
        raise HTTPException(status_code=403, detail="Dropshipping is not enabled for your account")
    return customer


def _clean_name(filename: str) -> str:
    """Original file name for display only (never used as a path on disk)."""
    name = os.path.basename((filename or "").replace("\\", "/")).strip()
    return name[:255] or "file"


def _extension(filename: str) -> str:
    return os.path.splitext((filename or "").lower())[1]


def _check_signature(upload: UploadFile, allowed: tuple, error: str) -> None:
    head = upload.file.read(8)
    upload.file.seek(0)
    if not any(head.startswith(sig) for sig in allowed):
        raise HTTPException(status_code=400, detail=error)


def _remove_quietly(path: str) -> None:
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except OSError:
        pass


def _save_upload(upload: UploadFile, dest_path: str, max_bytes: int, label: str) -> None:
    """Write the upload to disk in chunks, enforcing the size limit."""
    size = 0
    try:
        with open(dest_path, "wb") as out:
            while True:
                chunk = upload.file.read(CHUNK_SIZE)
                if not chunk:
                    break
                size += len(chunk)
                if size > max_bytes:
                    raise HTTPException(
                        status_code=413,
                        detail=f"{label} is too large (maximum {max_bytes // (1024 * 1024)} MB)",
                    )
                out.write(chunk)
    except HTTPException:
        _remove_quietly(dest_path)
        raise
    except Exception:
        _remove_quietly(dest_path)
        raise HTTPException(status_code=500, detail=f"Failed to save {label}")

    if size == 0:
        _remove_quietly(dest_path)
        raise HTTPException(status_code=400, detail=f"{label} is empty")


def _to_out(entry: DropshippingEntry) -> DropshippingEntryOut:
    out = DropshippingEntryOut.model_validate(entry)
    # Prep invoices are hidden from customers until the owner makes them
    # visible, so the invoice link is never exposed here.
    out.prep_invoice_id = None
    out.prep_invoice_number = None
    return out


def _get_own_entry(db: Session, customer: Customer, entry_id: UUID) -> DropshippingEntry:
    entry = db.query(DropshippingEntry).filter(
        DropshippingEntry.id == entry_id,
        DropshippingEntry.customer_id == customer.id,
        DropshippingEntry.company_id == customer.company_id,
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


def _file_response(path: str, original_name: str) -> FileResponse:
    if not path or not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found on server")
    media_type = MEDIA_TYPES.get(os.path.splitext(path.lower())[1], "application/octet-stream")
    return FileResponse(path=path, media_type=media_type, filename=original_name)


# ---------------------------------------------------------------- endpoints

@router.post("/entries", response_model=DropshippingEntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    entry_date: date = Form(...),
    excel_file: UploadFile = File(...),
    labels_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Customer adds a Dropshipping inventory entry (Excel + labels PDF)."""
    customer = _require_dropshipping_customer(db, current_user)

    # Validate both files before anything is written to disk
    excel_ext = _extension(excel_file.filename)
    if excel_ext not in (".xlsx", ".xls"):
        raise HTTPException(status_code=400, detail="Inventory details must be an Excel file (.xlsx or .xls)")
    _check_signature(
        excel_file,
        (XLSX_SIGNATURE, XLS_SIGNATURE),
        "Inventory details file is not a valid Excel file",
    )

    if _extension(labels_file.filename) != ".pdf":
        raise HTTPException(status_code=400, detail="Labels must be a PDF file")
    _check_signature(labels_file, (PDF_SIGNATURE,), "Labels file is not a valid PDF")

    # Files are stored under the entry id, never under the customer's file name
    entry_id = uuid.uuid4()
    excel_path = os.path.join(UPLOAD_DIR, f"{entry_id}_inventory{excel_ext}")
    labels_path = os.path.join(UPLOAD_DIR, f"{entry_id}_labels.pdf")

    _save_upload(excel_file, excel_path, MAX_EXCEL_BYTES, "Inventory details file")
    try:
        _save_upload(labels_file, labels_path, MAX_LABELS_BYTES, "Labels file")
    except HTTPException:
        _remove_quietly(excel_path)
        raise

    entry = DropshippingEntry(
        id=entry_id,
        company_id=customer.company_id,
        customer_id=customer.id,
        entry_date=entry_date,
        excel_file_path=excel_path,
        excel_original_name=_clean_name(excel_file.filename),
        labels_file_path=labels_path,
        labels_original_name=_clean_name(labels_file.filename),
        created_by=current_user.id,
    )

    try:
        db.add(entry)
        db.commit()
        db.refresh(entry)
    except Exception:
        db.rollback()
        _remove_quietly(excel_path)
        _remove_quietly(labels_path)
        raise HTTPException(status_code=500, detail="Failed to save the entry")

    return _to_out(entry)


@router.get("/my-entries", response_model=List[DropshippingEntryOut])
def list_my_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Customer's own entries, newest first."""
    customer = _require_dropshipping_customer(db, current_user)

    entries = db.query(DropshippingEntry).filter(
        DropshippingEntry.customer_id == customer.id,
        DropshippingEntry.company_id == customer.company_id,
    ).order_by(DropshippingEntry.created_at.desc(), DropshippingEntry.entry_number.desc()).all()

    return [_to_out(e) for e in entries]


@router.get("/my-entries/{entry_id}/excel")
def download_my_excel(
    entry_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer = _require_dropshipping_customer(db, current_user)
    entry = _get_own_entry(db, customer, entry_id)
    return _file_response(entry.excel_file_path, entry.excel_original_name)


@router.get("/my-entries/{entry_id}/labels")
def download_my_labels(
    entry_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customer = _require_dropshipping_customer(db, current_user)
    entry = _get_own_entry(db, customer, entry_id)
    return _file_response(entry.labels_file_path, entry.labels_original_name)