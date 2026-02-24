from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.core.dependencies import get_db, require_role
from app.models.registration import RegistrationRequest as RegistrationDBModel  # Rename import
from app.models.user import User
from app.models.customer import Customer
from app.models.customer_warehouse import CustomerWarehouse
from app.core.security import get_password_hash
from pydantic import BaseModel
from app.services.email_service import EmailService
import asyncio
from concurrent.futures import ThreadPoolExecutor
import threading
import atexit

router = APIRouter(prefix="/registrations", tags=["Registrations"])
executor = ThreadPoolExecutor()

class RegistrationResponse(BaseModel):
    id: UUID
    customer_name: str
    email: str
    phone: str
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    notes: Optional[str] = None
    status: str
    rejection_reason: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ApproveRequest(BaseModel):
    customer_code: str
    prep_rate: float
    warehouse_ids: List[UUID]

class DeclineRequest(BaseModel):
    reason: str


def send_email_sync(to_email: str, subject: str, body: str):
    """Synchronous wrapper for email sending"""
    try:
        # Create a new event loop for this thread
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            EmailService.send_email(to_email, subject, body)
        )
        loop.close()
        return result
    except Exception as e:
        print(f"Email sending failed: {str(e)}")
        return False

@router.get("/", response_model=List[RegistrationResponse])
def get_registrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner")),
    status: str = None
):
    """Get all registration requests"""
    query = db.query(RegistrationDBModel)  # Use renamed import
    
    if status:
        query = query.filter(RegistrationDBModel.status == status)
    
    registrations = query.order_by(RegistrationDBModel.created_at.desc()).all()
    return registrations

@router.get("/{registration_id}", response_model=RegistrationResponse)
def get_registration(
    registration_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Get single registration request"""
    registration = db.query(RegistrationDBModel).filter(  # Use renamed import
        RegistrationDBModel.id == registration_id
    ).first()
    
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    return registration

@router.post("/{registration_id}/approve", response_model=dict)
def approve_registration(
    registration_id: UUID,
    approve_data: ApproveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Approve registration request and create customer"""
    
    registration = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.id == registration_id,
        RegistrationDBModel.status == 'pending'
    ).first()
    
    if not registration:
        raise HTTPException(status_code=404, detail="Pending registration not found")
    
    # Check if email already used
    existing_customer = db.query(Customer).filter(Customer.email == registration.email).first()
    if existing_customer:
        raise HTTPException(status_code=400, detail="Email already registered as customer")
    
    existing_user = db.query(User).filter(User.email == registration.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already has user account")
    
    # Create customer
    customer = Customer(
        company_id=current_user.company_id,
        customer_name=registration.customer_name,
        customer_code=approve_data.customer_code,
        email=registration.email,
        prep_rate=approve_data.prep_rate,
        is_active=True
    )
    db.add(customer)
    db.flush()
    
    # Add warehouse assignments
    for warehouse_id in approve_data.warehouse_ids:
        assignment = CustomerWarehouse(
            customer_id=customer.id,
            warehouse_id=warehouse_id
        )
        db.add(assignment)
    
    # Create user account
    user = User(
        company_id=current_user.company_id,
        email=registration.email,
        password_hash=registration.password_hash,
        full_name=registration.customer_name,
        role='customer',
        customer_id=customer.id,
        is_active=True
    )
    db.add(user)
    
    # Update registration status
    registration.status = 'approved'
    registration.reviewed_at = datetime.now()
    registration.reviewed_by = current_user.id
    
    db.commit()
    
    # Send approval email
    try:
        email_body = EmailService.get_approve_email_template(
            registration.customer_name,
            approve_data.customer_code
        )
        
        executor.submit(
            send_email_sync,
            registration.email,
            "Registration Approved - Welcome to Peaknizer Logistics!",
            email_body
        )
        print(f"Approval email queued for {registration.email}")
        
    except Exception as e:
        print(f"Failed to queue approval email: {str(e)}")
    
    return {
        "message": "Registration approved and customer created successfully",
        "customer_id": str(customer.id),
        "customer_code": customer.customer_code
    }

@router.post("/{registration_id}/decline", response_model=dict)
def decline_registration(
    registration_id: UUID,
    decline_data: DeclineRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Decline registration request"""
    
    registration = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.id == registration_id,
        RegistrationDBModel.status == 'pending'
    ).first()
    
    if not registration:
        raise HTTPException(status_code=404, detail="Pending registration not found")
    
    registration.status = 'declined'
    registration.rejection_reason = decline_data.reason
    registration.reviewed_at = datetime.now()
    registration.reviewed_by = current_user.id
    
    db.commit()
    
    # Send email notification in background thread
    try:
        email_body = EmailService.get_decline_email_template(
            registration.customer_name, 
            decline_data.reason
        )
        
        # Run in thread pool to avoid blocking
        executor.submit(
            send_email_sync,
            registration.email,
            "Registration Declined - Peaknizer Logistics",
            email_body
        )
        print(f"Email task submitted for {registration.email}")
        
    except Exception as e:
        print(f"Failed to queue decline email: {str(e)}")
    
    return {"message": "Registration declined"}




@atexit.register
def cleanup():
    """Clean up thread pool on server shutdown"""
    executor.shutdown(wait=False)
    print("Email executor shutdown")