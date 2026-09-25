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

    total_quantity: Optional[int] = None
    total_prep_value: Optional[Decimal] = None
    discount_percentage: Optional[float] = None


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

    customer_name: Optional[str] = None
    customer_code: Optional[str] = None
    batch_id: Optional[UUID] = None
    batch_upload_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class CustomerInvoiceSummaryOut(BaseModel):
    customer_id: UUID
    customer_name: str
    customer_code: str
    total_count: int
    shipping_count: int
    prep_count: int
    paid_count: int
    unpaid_count: int
    shipping_unpaid_balance: Decimal
    prep_unpaid_balance: Decimal

    class Config:
        from_attributes = True