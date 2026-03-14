from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal

class ExcelBatchRowBase(BaseModel):
    tracking_number: str
    quantity: int = 1 
    label_cost: Decimal
    end_customer_name: str
    order_number: str
    
    date: date

class ExcelBatchRowCreate(ExcelBatchRowBase):
    pass

class ExcelBatchRowOut(ExcelBatchRowBase):
    id: UUID
    batch_id: UUID
    company_id: UUID
    is_valid: bool
    validation_errors: Optional[str] = None
    created_at: datetime
    quantity: int 
    
    class Config:
        from_attributes = True

class ExcelBatchBase(BaseModel):
    customer_id: UUID
    notes: Optional[str] = None

class ExcelBatchCreate(ExcelBatchBase):
    pass

class ExcelBatchOut(ExcelBatchBase):
    id: UUID
    company_id: UUID
    uploaded_by: UUID
    upload_date: datetime
    status: str
    original_file_url: Optional[str] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[UUID] = None
    created_at: datetime
    rows: Optional[List[ExcelBatchRowOut]] = None
    
    class Config:
        from_attributes = True

class ExcelBatchUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class BatchApproveRequest(BaseModel):
    issue_date: date
    due_date: date
    
class ExcelBatchOut(ExcelBatchBase):
    id: UUID
    company_id: UUID
    uploaded_by: UUID
    upload_date: datetime
    status: str
    original_file_url: Optional[str] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[UUID] = None
    created_at: datetime
    rows: Optional[List[ExcelBatchRowOut]] = None
    
    # New fields
    customer_code: Optional[str] = None
    uploader_name: Optional[str] = None
    
    class Config:
        from_attributes = True
    ...
    customer_code: Optional[str] = None
    uploader_name: Optional[str] = None