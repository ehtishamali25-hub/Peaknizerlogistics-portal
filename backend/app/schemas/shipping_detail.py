from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date

class ShippingDetailBase(BaseModel):
    issue_date: date
    is_visible_to_customer: bool = False

class ShippingDetailCreate(ShippingDetailBase):
    customer_id: UUID
    batch_id: UUID
    created_by: UUID
    company_id: UUID

class ShippingDetailOut(ShippingDetailBase):
    id: UUID
    company_id: UUID
    customer_id: UUID
    batch_id: UUID
    excel_file_url: Optional[str] = None
    pdf_file_url: Optional[str] = None
    created_by: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
