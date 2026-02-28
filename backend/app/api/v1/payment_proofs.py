from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import os
import shutil
from datetime import datetime

from app.core.dependencies import get_db, get_current_user, require_role
from app.models.payment_proof import PaymentProof
from app.models.invoice import Invoice
from app.models.user import User
from app.schemas.payment_proof import PaymentProofCreate, PaymentProofOut, PaymentProofVerify

router = APIRouter(prefix="/payment-proofs", tags=["Payment Proofs"])

UPLOAD_DIR = "uploads/proofs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=PaymentProofOut, status_code=status.HTTP_201_CREATED)
async def upload_payment_proof(
    invoice_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Customer uploads payment proof for an invoice"""
    
    # Only customers can upload proofs
    if current_user.role != 'customer':
        raise HTTPException(status_code=403, detail="Only customers can upload payment proofs")
    
    # Verify invoice exists and belongs to this customer
    invoice = db.query(Invoice).filter(
        Invoice.id == UUID(invoice_id),
        Invoice.customer_id == current_user.customer_id,
        Invoice.company_id == current_user.company_id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Validate file type
    allowed_types = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.txt']
    if not any(file.filename.lower().endswith(ext) for ext in allowed_types):
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed: {', '.join(allowed_types)}")
    
    # Save file
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"proof_{invoice_id}_{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Create payment proof record
    proof_data = PaymentProofCreate(
        invoice_id=UUID(invoice_id),
        file_url=file_path,
        uploaded_by=current_user.id,
        company_id=current_user.company_id
    )
    
    db_proof = PaymentProof(**proof_data.dict())
    db.add(db_proof)
    db.commit()
    db.refresh(db_proof)
    
    return db_proof

@router.get("/invoice/{invoice_id}", response_model=List[PaymentProofOut])
def get_proofs_for_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Owner views all proofs for an invoice"""
    
    proofs = db.query(PaymentProof).filter(
        PaymentProof.invoice_id == invoice_id,
        PaymentProof.company_id == current_user.company_id
    ).order_by(PaymentProof.uploaded_at.desc()).all()
    
    return proofs

@router.put("/{proof_id}/verify", response_model=PaymentProofOut)
def verify_payment_proof(
    proof_id: UUID,
    verify_data: PaymentProofVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Owner verifies or rejects a payment proof"""
    
    proof = db.query(PaymentProof).filter(
        PaymentProof.id == proof_id,
        PaymentProof.company_id == current_user.company_id
    ).first()
    
    if not proof:
        raise HTTPException(status_code=404, detail="Payment proof not found")
    
    proof.verified = verify_data.verified
    proof.verified_by = current_user.id
    proof.verified_at = datetime.now()
    
    db.commit()
    db.refresh(proof)
    
    return proof


@router.get("/{proof_id}/download")
def download_proof(
    proof_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download payment proof file"""
    
    proof = db.query(PaymentProof).filter(
        PaymentProof.id == proof_id,
        PaymentProof.company_id == current_user.company_id
    ).first()
    
    if not proof:
        raise HTTPException(status_code=404, detail="Proof not found")
    
    # Check if user has access
    if current_user.role == 'customer' and proof.uploaded_by != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not os.path.exists(proof.file_url):
        raise HTTPException(status_code=404, detail="File not found")
    
    filename = os.path.basename(proof.file_url)
    return FileResponse(
        proof.file_url,
        media_type='application/octet-stream',
        filename=filename
    )