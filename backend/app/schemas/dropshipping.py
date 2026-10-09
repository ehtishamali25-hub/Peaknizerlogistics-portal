from pydantic import BaseModel
from typing import Optional, Literal, List, Any
from uuid import UUID
from datetime import datetime, date

ShippingStatus = Literal['unshipped', 'partially_shipped', 'shipped']
ArrivalStatus = Literal['not_received', 'partially_received', 'fully_received']
ApprovalStatus = Literal['pending', 'approved']


class DropshippingEntryOut(BaseModel):
    id: UUID
    entry_number: int
    entry_code: str                      # e.g. DS-00001
    customer_id: UUID
    entry_date: date
    excel_original_name: str
    labels_original_name: str
    shipping_status: ShippingStatus
    arrival_status: ArrivalStatus
    approval_status: ApprovalStatus
    approved_at: Optional[datetime] = None
    created_at: datetime

    # Linked Prep invoice (after approval)
    prep_invoice_id: Optional[UUID] = None
    prep_invoice_number: Optional[str] = None

    # Filled in by the owner / employee views
    customer_name: Optional[str] = None
    customer_code: Optional[str] = None

    class Config:
        from_attributes = True


class DropshippingStatusUpdate(BaseModel):
    """Owner / employee: change Status and/or Arrival. Send at least one."""
    shipping_status: Optional[ShippingStatus] = None
    arrival_status: Optional[ArrivalStatus] = None


class ExcelPreviewOut(BaseModel):
    """First rows of an entry's Excel file, for the pop-up table."""
    sheet_name: Optional[str] = None
    columns: List[str]
    rows: List[List[Any]]
    total_rows: int
    truncated: bool = False