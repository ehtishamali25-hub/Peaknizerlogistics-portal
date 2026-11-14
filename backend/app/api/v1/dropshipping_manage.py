import datetime as dt
import logging
import os
from decimal import ROUND_HALF_UP, Decimal
from typing import Any, Dict, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.access import get_assigned_customer_ids
from app.core.dependencies import get_current_user, get_db
from app.models.customer import Customer
from app.models.dropshipping_entry import DropshippingEntry
from app.models.invoice import Invoice
from app.models.user import User
from app.schemas.dropshipping import (
    DropshippingEntryOut,
    DropshippingStatusUpdate,
    ExcelPreviewOut,
)
from app.services.invoice_service import InvoiceService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dropshipping-manage", tags=["Dropshipping (Owner / Employee)"])

MEDIA_TYPES = {
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls": "application/vnd.ms-excel",
    ".pdf": "application/pdf",
}

DEFAULT_PREVIEW_ROWS = 200
MAX_PREVIEW_ROWS = 1000
MAX_SCAN_ROWS = 50000     # stop counting rows after this many
MAX_PREVIEW_COLUMNS = 100

DEFAULT_PREP_RATE = Decimal("5.5")            # same fallback the batch invoices use
MAX_PREP_QUANTITY = 1_000_000
MAX_INVOICE_AMOUNT = Decimal("99999999.99")   # invoices.total_amount is DECIMAL(10,2)


class DropshippingApproveIn(BaseModel):
    """Owner approves an entry. `quantity` = number of units to prep; it is
    billed at the customer's prep rate."""
    quantity: int = Field(..., ge=1, le=MAX_PREP_QUANTITY)


# ---------------------------------------------------------------- access helpers

def _require_staff(user: User) -> None:
    if user.role not in ("owner", "employee"):
        raise HTTPException(status_code=403, detail="Not enough permissions")


def _get_accessible_customer(db: Session, user: User, customer_id: UUID) -> Customer:
    """Customer of this company; employees only if the customer is assigned to them.
    Returns 404 (not 403) so employees cannot discover other customers."""
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.company_id == user.company_id,
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    if user.role == "employee":
        assigned = get_assigned_customer_ids(db, user)
        # Fail closed: an employee with no assignment list sees nothing
        if assigned is None or str(customer.id) not in {str(a) for a in assigned}:
            raise HTTPException(status_code=404, detail="Customer not found")

    return customer


def _require_dropshipping_model(customer: Customer) -> None:
    # Entries of a customer switched back to Wholesale stay saved but hidden
    if customer.business_model != "dropshipping":
        raise HTTPException(status_code=400, detail="This customer is not on the Dropshipping model")


def _get_entry_for_staff(db: Session, user: User, entry_id: UUID) -> DropshippingEntry:
    entry = db.query(DropshippingEntry).filter(
        DropshippingEntry.id == entry_id,
        DropshippingEntry.company_id == user.company_id,
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    customer = _get_accessible_customer(db, user, entry.customer_id)
    _require_dropshipping_model(customer)
    return entry


def _to_out(entry: DropshippingEntry, customer: Customer, user: User, invoice_numbers: Dict[Any, str]) -> DropshippingEntryOut:
    out = DropshippingEntryOut.model_validate(entry)
    out.customer_name = customer.customer_name
    out.customer_code = customer.customer_code
    if user.role == "owner":
        out.prep_invoice_number = invoice_numbers.get(entry.prep_invoice_id)
    else:
        # Employees do not deal with invoices
        out.prep_invoice_id = None
        out.prep_invoice_number = None
    return out


def _file_response(path: str, original_name: str) -> FileResponse:
    if not path or not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found on server")
    media_type = MEDIA_TYPES.get(os.path.splitext(path.lower())[1], "application/octet-stream")
    return FileResponse(path=path, media_type=media_type, filename=original_name)


# ---------------------------------------------------------------- Excel preview

def _cell_value(value: Any) -> Any:
    """Make a cell JSON-friendly: numbers/text stay, dates become text, empty becomes ''."""
    if value is None:
        return ""
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, dt.datetime):
        if value.hour == 0 and value.minute == 0 and value.second == 0:
            return value.date().isoformat()
        return value.isoformat(sep=" ")
    if isinstance(value, (dt.date, dt.time)):
        return value.isoformat()
    return str(value)


def _iter_xlsx_rows(path: str):
    from openpyxl import load_workbook

    wb = load_workbook(path, read_only=True, data_only=True)
    try:
        ws = wb.worksheets[0] if wb.worksheets else None
        if ws is None:
            yield None, []
            return
        yield ws.title, None
        for row in ws.iter_rows(values_only=True):
            yield None, list(row)
    finally:
        wb.close()


def _iter_xls_rows(path: str):
    try:
        import xlrd
    except ImportError:
        raise HTTPException(
            status_code=501,
            detail="Preview of old .xls files is not available on the server. Please download the file instead.",
        )

    book = xlrd.open_workbook(path)
    try:
        sheet = book.sheet_by_index(0)
        yield sheet.name, None
        for r in range(sheet.nrows):
            row = []
            for c in range(sheet.ncols):
                cell = sheet.cell(r, c)
                if cell.ctype == xlrd.XL_CELL_DATE:
                    try:
                        row.append(xlrd.xldate_as_datetime(cell.value, book.datemode))
                    except Exception:
                        row.append(cell.value)
                elif cell.ctype in (xlrd.XL_CELL_EMPTY, xlrd.XL_CELL_BLANK):
                    row.append(None)
                elif cell.ctype == xlrd.XL_CELL_BOOLEAN:
                    row.append(bool(cell.value))
                elif cell.ctype == xlrd.XL_CELL_NUMBER and float(cell.value).is_integer():
                    row.append(int(cell.value))
                else:
                    row.append(cell.value)
            yield None, row
    finally:
        book.release_resources()


def build_excel_preview(path: str, max_rows: int) -> ExcelPreviewOut:
    ext = os.path.splitext(path.lower())[1]
    if ext == ".xlsx":
        source = _iter_xlsx_rows(path)
    elif ext == ".xls":
        source = _iter_xls_rows(path)
    else:
        raise HTTPException(status_code=400, detail="Not an Excel file")

    sheet_name = None
    header = None
    rows: List[List[Any]] = []
    data_rows = 0
    scanned = 0
    scan_capped = False

    try:
        for title, row in source:
            if row is None:            # first item carries the sheet name
                sheet_name = title
                continue

            cells = [_cell_value(v) for v in row[:MAX_PREVIEW_COLUMNS]]
            # drop trailing empty cells, skip fully empty rows
            while cells and cells[-1] == "":
                cells.pop()
            if not cells:
                continue

            scanned += 1
            if header is None:
                header = cells
                continue

            data_rows += 1
            if len(rows) < max_rows:
                rows.append(cells)
            if scanned >= MAX_SCAN_ROWS:
                scan_capped = True
                break
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=422, detail="Could not read this Excel file. Please download it instead.")
    finally:
        source.close()

    header = header or []
    width = max([len(header)] + [len(r) for r in rows]) if (header or rows) else 0
    columns = [
        (str(header[i]).strip() if i < len(header) and str(header[i]).strip() != "" else f"Column {i + 1}")
        for i in range(width)
    ]
    rows = [r + [""] * (width - len(r)) for r in rows]

    return ExcelPreviewOut(
        sheet_name=sheet_name,
        columns=columns,
        rows=rows,
        total_rows=data_rows,
        truncated=scan_capped or data_rows > len(rows),
    )


# ---------------------------------------------------------------- endpoints

@router.get("/customers/{customer_id}/entries", response_model=List[DropshippingEntryOut])
def list_customer_entries(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """A Dropshipping customer's entries, newest first (owner / assigned employee)."""
    _require_staff(current_user)
    customer = _get_accessible_customer(db, current_user, customer_id)
    _require_dropshipping_model(customer)

    entries = db.query(DropshippingEntry).filter(
        DropshippingEntry.customer_id == customer.id,
        DropshippingEntry.company_id == current_user.company_id,
    ).order_by(DropshippingEntry.created_at.desc(), DropshippingEntry.entry_number.desc()).all()

    invoice_numbers: Dict[Any, str] = {}
    if current_user.role == "owner":
        invoice_ids = [e.prep_invoice_id for e in entries if e.prep_invoice_id]
        if invoice_ids:
            invoice_numbers = {
                inv.id: inv.invoice_number
                for inv in db.query(Invoice).filter(Invoice.id.in_(invoice_ids)).all()
            }

    return [_to_out(e, customer, current_user, invoice_numbers) for e in entries]


@router.get("/entries/{entry_id}/excel")
def download_entry_excel(
    entry_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_staff(current_user)
    entry = _get_entry_for_staff(db, current_user, entry_id)
    return _file_response(entry.excel_file_path, entry.excel_original_name)


@router.get("/entries/{entry_id}/labels")
def download_entry_labels(
    entry_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_staff(current_user)
    entry = _get_entry_for_staff(db, current_user, entry_id)
    return _file_response(entry.labels_file_path, entry.labels_original_name)


@router.get("/entries/{entry_id}/excel-preview", response_model=ExcelPreviewOut)
def preview_entry_excel(
    entry_id: UUID,
    max_rows: int = Query(DEFAULT_PREVIEW_ROWS, ge=1, le=MAX_PREVIEW_ROWS),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """First rows of the entry's Excel file as JSON, for the pop-up table."""
    _require_staff(current_user)
    entry = _get_entry_for_staff(db, current_user, entry_id)

    if not entry.excel_file_path or not os.path.exists(entry.excel_file_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    return build_excel_preview(entry.excel_file_path, max_rows)


@router.patch("/entries/{entry_id}/status", response_model=DropshippingEntryOut)
def update_entry_status(
    entry_id: UUID,
    data: DropshippingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Owner / assigned employee changes Status (shipping) and/or Arrival at warehouse."""
    _require_staff(current_user)

    if data.shipping_status is None and data.arrival_status is None:
        raise HTTPException(status_code=400, detail="Send shipping_status and/or arrival_status")

    entry = _get_entry_for_staff(db, current_user, entry_id)

    if data.shipping_status is not None:
        entry.shipping_status = data.shipping_status
    if data.arrival_status is not None:
        entry.arrival_status = data.arrival_status

    db.commit()
    db.refresh(entry)

    customer = db.query(Customer).filter(Customer.id == entry.customer_id).first()
    invoice_numbers: Dict[Any, str] = {}
    if current_user.role == "owner" and entry.prep_invoice_id:
        inv = db.query(Invoice).filter(Invoice.id == entry.prep_invoice_id).first()
        if inv:
            invoice_numbers[inv.id] = inv.invoice_number

    return _to_out(entry, customer, current_user, invoice_numbers)


@router.post("/entries/{entry_id}/approve", response_model=DropshippingEntryOut)
def approve_entry(
    entry_id: UUID,
    data: DropshippingApproveIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Owner only. Approves the entry and generates its single Prep invoice.

    - amount = quantity x the customer's prep rate (no discount)
    - issue date and due date = the day the customer uploaded the entry
    - the invoice stays hidden from the customer until the owner makes it visible
    - an entry can be approved only once
    """
    _require_staff(current_user)
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Only the owner can approve inventory")

    entry = _get_entry_for_staff(db, current_user, entry_id)

    # Lock the row, so a double click or a second owner session cannot create two invoices
    db.refresh(entry, with_for_update=True)
    if entry.approval_status == "approved" or entry.prep_invoice_id:
        raise HTTPException(status_code=409, detail="This entry is already approved")

    customer = db.query(Customer).filter(Customer.id == entry.customer_id).first()
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    prep_rate = Decimal(str(customer.prep_rate)) if customer.prep_rate is not None else DEFAULT_PREP_RATE
    if prep_rate <= 0:
        raise HTTPException(status_code=400, detail="This customer's prep rate must be greater than zero")

    total_amount = (Decimal(data.quantity) * prep_rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    if total_amount > MAX_INVOICE_AMOUNT:
        raise HTTPException(status_code=400, detail="The invoice amount is too large. Please check the quantity.")

    # The day the customer really uploaded the entry (not the date they typed in)
    upload_day = entry.created_at.date()

    pdf_path = None
    try:
        invoice_number = InvoiceService.generate_invoice_number(entry.company_id, "prep", db)

        invoice = Invoice(
            company_id=entry.company_id,
            invoice_number=invoice_number,
            customer_id=customer.id,
            shipping_details_id=None,          # dropshipping has no shipping details
            invoice_type="prep",
            quantity=data.quantity,
            rate=prep_rate,
            total_amount=total_amount,
            issue_date=upload_day,
            due_date=upload_day,
            status="unpaid",
            is_visible_to_customer=False,
            created_by=current_user.id,
            total_quantity=data.quantity,
            total_prep_value=total_amount,
            discount_percentage=0.0,
        )
        db.add(invoice)
        db.flush()

        # Same PDF as the other Prep invoices
        pdf_path = InvoiceService.pdf_service.generate_invoice_pdf({
            "invoice_number": invoice_number,
            "invoice_type": "prep",
            "customer_name": customer.customer_name,
            "customer_code": customer.customer_code,
            "issue_date": upload_day.strftime("%Y-%m-%d"),
            "due_date": upload_day.strftime("%Y-%m-%d"),
            "status": "unpaid",
            "total_amount": float(total_amount),
            "quantity": data.quantity,
            "rate": float(prep_rate),
            "total_quantity": data.quantity,
            "total_prep_value": float(total_amount),
            "discount_percentage": 0.0,
        })
        invoice.pdf_url = pdf_path

        entry.approval_status = "approved"
        entry.prep_invoice_id = invoice.id
        entry.approved_by = current_user.id
        entry.approved_at = dt.datetime.now(dt.timezone.utc)

        db.commit()
    except Exception:
        db.rollback()
        # Do not leave an orphan PDF behind
        if pdf_path:
            try:
                if os.path.exists(pdf_path):
                    os.remove(pdf_path)
            except OSError:
                pass
        logger.exception("Dropshipping approve failed for entry %s", entry_id)
        raise HTTPException(status_code=500, detail="Failed to generate the Prep invoice. Nothing was changed.")

    db.refresh(entry)
    return _to_out(entry, customer, current_user, {entry.prep_invoice_id: invoice_number})