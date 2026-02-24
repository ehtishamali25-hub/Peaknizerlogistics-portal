from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str
    is_active: bool = True

class UserCreate(UserBase):
    password: str
    company_id: UUID
    customer_id: Optional[UUID] = None
    customer_ids: List[UUID] = []
    warehouse_ids: List[UUID] = []

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    customer_ids: Optional[List[UUID]] = None
    warehouse_ids: Optional[List[UUID]] = None

class UserOut(UserBase):
    id: UUID
    company_id: UUID
    customer_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True