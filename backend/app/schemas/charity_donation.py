from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal

class CharityDonationBase(BaseModel):
    donor_name: str
    contact: Optional[str] = None
    purpose: Optional[str] = None
    amount: Decimal
    donated_on: Optional[date] = None

class CharityDonationCreate(CharityDonationBase):
    company_id: UUID
    created_by: UUID

class CharityDonationUpdate(BaseModel):
    donor_name: Optional[str] = None
    contact: Optional[str] = None
    purpose: Optional[str] = None
    amount: Optional[Decimal] = None
    donated_on: Optional[date] = None

class CharityDonationOut(CharityDonationBase):
    id: UUID
    company_id: UUID
    donated_on: date
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class CharitySummaryOut(BaseModel):
    total_amount_for_charity: Decimal
    amount_donated: Decimal
    balance_remaining: Decimal