from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class PaymentProofBase(BaseModel):
    invoice_id: UUID
    file_url: str

class PaymentProofCreate(PaymentProofBase):
    uploaded_by: UUID
    company_id: UUID

class PaymentProofOut(PaymentProofBase):
    id: UUID
    company_id: UUID
    uploaded_by: UUID
    uploaded_at: datetime
    verified: bool
    verified_by: Optional[UUID] = None
    verified_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class PaymentProofVerify(BaseModel):
    verified: bool
