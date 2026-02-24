from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class CustomerBase(BaseModel):
    customer_name: str
    customer_code: str
    email: EmailStr
    prep_rate: Decimal = Decimal('5.5')
    is_active: bool = True

class CustomerCreate(CustomerBase):
    warehouse_ids: List[UUID] = []
    password: Optional[str] = None

class CustomerUpdate(BaseModel):
    customer_name: Optional[str] = None
    email: Optional[EmailStr] = None
    prep_rate: Optional[Decimal] = None
    is_active: Optional[bool] = None
    warehouse_ids: Optional[List[UUID]] = None

class CustomerOut(CustomerBase):
    id: UUID
    company_id: UUID
    created_at: datetime
    updated_at: datetime
    warehouse_ids: List[UUID] = []
    
    class Config:
        from_attributes = True