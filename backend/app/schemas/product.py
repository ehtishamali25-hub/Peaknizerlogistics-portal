from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class ProductBase(BaseModel):
    product_name: str
    sku: str
    batch_number: Optional[str] = None  
    is_active: bool = True

class ProductCreate(ProductBase):
    customer_id: UUID

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    sku: Optional[str] = None
    batch_number: Optional[str] = None 
    is_active: Optional[bool] = None

class ProductOut(ProductBase):
    id: UUID
    company_id: UUID
    customer_id: UUID
    created_at: datetime
    batch_number: Optional[str] = None
    
    class Config:
        from_attributes = True
