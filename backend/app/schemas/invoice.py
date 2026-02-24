from pydantic import BaseModel
from typing import Optional, Literal
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal

class InvoiceBase(BaseModel):
    invoice_type: str
    quantity: int
    rate: Optional[Decimal] = None
    total_amount: Decimal
    issue_date: date
    due_date: date
    status: Literal['unpaid', 'partially_paid', 'fully_paid'] = 'unpaid'
    is_visible_to_customer: bool = False

class InvoiceCreate(InvoiceBase):
    customer_id: UUID
    shipping_details_id: UUID
    invoice_number: str
    created_by: UUID
    company_id: UUID

class InvoiceUpdate(BaseModel):
    status: Optional[Literal['unpaid', 'partially_paid', 'fully_paid']] = None
    is_visible_to_customer: Optional[bool] = None

class InvoiceOut(InvoiceBase):
    id: UUID
    company_id: UUID
    invoice_number: str
    customer_id: UUID
    shipping_details_id: UUID
    pdf_url: Optional[str] = None
    created_by: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
