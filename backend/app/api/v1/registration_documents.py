import os
import mimetypes
from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.customer import Customer
from app.models.registration import RegistrationRequest
from app.models.registration_document import RegistrationDocument
from app.models.user import User

router = APIRouter(prefix="/registration-documents", tags=["Registration Documents"])


class RegistrationDocumentOut(BaseModel):
    # Deliberately does not expose the server-side file path
    id: UUID
    registration_id: UUID
    original_filename: str
    content_type: Optional[str] = None
    file_size: Optional[int] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True


@router.post("/batch", response_model=Dict[str, List[RegistrationDocumentOut]])
def get_documents_batch(
    registration_ids: List[str],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Documents for many registrations in one request (avoids N+1 calls)."""
    if not registration_ids:
        return {}

    try:
        reg_uuids = [UUID(rid) for rid in registration_ids]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid registration id")

    docs = db.query(RegistrationDocument).filter(
        RegistrationDocument.registration_id.in_(reg_uuids)
    ).order_by(RegistrationDocument.uploaded_at).all()

    result: Dict[str, List[RegistrationDocument]] = {}
    for doc in docs:
        result.setdefault(str(doc.registration_id), []).append(doc)

    return result


@router.post("/by-customers", response_model=Dict[str, List[RegistrationDocumentOut]])
def get_documents_by_customers(
    customer_ids: List[str],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Documents each customer uploaded when registering, keyed by customer id.
    A customer is linked to their registration by email (the approved
    registration with the same email). One request for the whole list."""
    if not customer_ids:
        return {}

    try:
        cust_uuids = [UUID(cid) for cid in customer_ids]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid customer id")

    customers = db.query(Customer).filter(
        Customer.id.in_(cust_uuids),
        Customer.company_id == current_user.company_id
    ).all()

    email_to_customer = {c.email.lower(): c.id for c in customers if c.email}
    if not email_to_customer:
        return {}

    registrations = db.query(RegistrationRequest).filter(
        func.lower(RegistrationRequest.email).in_(list(email_to_customer.keys())),
        RegistrationRequest.status == 'approved'
    ).all()

    reg_to_customer = {
        r.id: email_to_customer[r.email.lower()] for r in registrations
    }
    if not reg_to_customer:
        return {}

    docs = db.query(RegistrationDocument).filter(
        RegistrationDocument.registration_id.in_(list(reg_to_customer.keys()))
    ).order_by(RegistrationDocument.uploaded_at).all()

    result: Dict[str, List[RegistrationDocument]] = {}
    for doc in docs:
        customer_id = str(reg_to_customer[doc.registration_id])
        result.setdefault(customer_id, []).append(doc)

    return result


@router.get("/{document_id}/download")
def download_document(
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Owner opens/downloads a document a customer uploaded at registration."""
    doc = db.query(RegistrationDocument).filter(
        RegistrationDocument.id == document_id
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if not os.path.exists(doc.stored_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    media_type, _ = mimetypes.guess_type(doc.original_filename)

    return FileResponse(
        path=doc.stored_path,
        media_type=media_type or "application/octet-stream",
        filename=doc.original_filename
    )