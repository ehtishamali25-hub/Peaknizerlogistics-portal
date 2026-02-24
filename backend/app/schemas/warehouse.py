from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class WarehouseBase(BaseModel):
    name: str
    location: Optional[str] = None
    is_active: bool = True

class WarehouseCreate(WarehouseBase):
    company_id: UUID

class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None

class WarehouseOut(WarehouseBase):
    id: UUID
    company_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
