import os
import mimetypes
from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
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