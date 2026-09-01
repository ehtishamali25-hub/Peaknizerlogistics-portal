from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.dependencies import get_db, require_role
from app.models.user import User
from app.models.charity_donation import CharityDonation
from app.schemas.charity_donation import (
    CharityDonationCreate,
    CharityDonationUpdate,
    CharityDonationOut,
    CharitySummaryOut
)
from app.services.charity_service import CharityService

router = APIRouter(prefix="/charity", tags=["Charity"])


@router.get("/summary", response_model=CharitySummaryOut)
def get_charity_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Owner dashboard: total for charity, amount donated, balance remaining"""
    return CharityService.get_summary(current_user.company_id, db)


@router.get("/donations", response_model=List[CharityDonationOut])
def list_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """List all charity donation log rows"""
    return db.query(CharityDonation).filter(
        CharityDonation.company_id == current_user.company_id
    ).order_by(CharityDonation.donated_on.desc()).all()


@router.post("/donations", response_model=CharityDonationOut, status_code=status.HTTP_201_CREATED)
def create_donation(
    donation_in: CharityDonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Add a new row to the charity donation log"""
    donation = CharityDonation(
        company_id=current_user.company_id,
        donor_name=donation_in.donor_name,
        contact=donation_in.contact,
        purpose=donation_in.purpose,
        amount=donation_in.amount,
        donated_on=donation_in.donated_on,
        created_by=current_user.id
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation


@router.put("/donations/{donation_id}", response_model=CharityDonationOut)
def update_donation(
    donation_id: UUID,
    donation_in: CharityDonationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Edit a donation log row"""
    donation = db.query(CharityDonation).filter(
        CharityDonation.id == donation_id,
        CharityDonation.company_id == current_user.company_id
    ).first()

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    update_data = donation_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(donation, field, value)

    db.commit()
    db.refresh(donation)
    return donation


@router.delete("/donations/{donation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_donation(
    donation_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Delete a donation log row"""
    donation = db.query(CharityDonation).filter(
        CharityDonation.id == donation_id,
        CharityDonation.company_id == current_user.company_id
    ).first()

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    db.delete(donation)
    db.commit()
    return None