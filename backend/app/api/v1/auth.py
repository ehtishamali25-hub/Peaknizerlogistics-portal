from typing import Optional
import secrets
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import timedelta
from app.models.registration import RegistrationRequest as RegistrationDBModel

from app.core.security import verify_password, create_access_token, oauth2_scheme, get_password_hash
from app.core.dependencies import get_db, get_current_user, require_role
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse
from app.schemas.user import UserCreate, UserOut
from app.services.email_service import EmailService
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegistrationRequestSchema(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    password: str
    notes: Optional[str] = None


@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role, "company_id": str(user.company_id)},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=str(user.id),
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        company_id=str(user.company_id)
    )


@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "company_id": str(current_user.company_id),
        "is_active": current_user.is_active
    }


@router.post("/register", response_model=UserOut)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Register a new user (owner only)"""
    
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    
    user_dict = user_data.dict(exclude={'password', 'customer_ids', 'warehouse_ids'})
    db_user = User(
        **user_dict,
        password_hash=hashed_password
    )
    
    db.add(db_user)
    db.flush()
    
    from app.models.employee_customer import EmployeeCustomer
    for customer_id in user_data.customer_ids:
        assignment = EmployeeCustomer(
            employee_id=db_user.id,
            customer_id=customer_id
        )
        db.add(assignment)
    
    from app.models.employee_warehouse import EmployeeWarehouse
    for warehouse_id in user_data.warehouse_ids:
        assignment = EmployeeWarehouse(
            employee_id=db_user.id,
            warehouse_id=warehouse_id
        )
        db.add(assignment)
    
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.post("/register-request")
def register_request(
    request_data: RegistrationRequestSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Submit registration request with email verification"""
    
    # Check if email already exists in users (active accounts)
    existing_user = db.query(User).filter(User.email == request_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check for pending unverified request
    existing_pending = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'pending',
        RegistrationDBModel.is_verified == False
    ).first()
    
    if existing_pending:
        raise HTTPException(status_code=400, detail="Please verify your email first. Check your inbox.")
    
    # Check for verified but not approved
    existing_verified = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'pending',
        RegistrationDBModel.is_verified == True
    ).first()
    
    if existing_verified:
        raise HTTPException(status_code=400, detail="Registration already submitted. Awaiting approval.")
    
    # Check for approved request
    existing_approved = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'approved'
    ).first()
    
    if existing_approved:
        raise HTTPException(status_code=400, detail="This email already has an approved registration")
    
    # Delete old declined record
    existing_declined = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'declined'
    ).first()
    
    if existing_declined:
        db.delete(existing_declined)
        db.commit()
    
    # Generate verification token
    verification_token = secrets.token_urlsafe(32)
    
    # Hash password
    hashed_password = get_password_hash(request_data.password)
    
    # Create registration request
    registration = RegistrationDBModel(
        customer_name=request_data.customer_name,
        email=request_data.email,
        phone=request_data.phone,
        company_name=request_data.company_name,
        company_address=request_data.company_address,
        password_hash=hashed_password,
        notes=request_data.notes,
        status='pending',
        is_verified=False,
        verification_token=verification_token
    )
    
    db.add(registration)
    db.commit()
    
    # Send verification email
    frontend_url = "https://peaknizerlogistics-portal-frontend.onrender.com"
    verification_link = f"{frontend_url}/verify-email?token={verification_token}&email={request_data.email}"
    
    email_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #f44336; color: white; padding: 20px; text-align: center; }}
            .button {{ background-color: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }}
            .footer {{ margin-top: 30px; font-size: 12px; color: #666; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Verify Your Email Address</h2>
            </div>
            <p>Dear {request_data.customer_name},</p>
            <p>Thank you for registering with <strong>Peaknizer Logistics</strong>. Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="{verification_link}" class="button">Verify Email</a>
            </p>
            <p>Or copy and paste this link: <br>{verification_link}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not create this account, please ignore this email.</p>
            <div class="footer">
                <p>&copy; 2026 Peaknizer Logistics. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    background_tasks.add_task(
        EmailService.send_email,
        request_data.email,
        "Verify Your Email - Peaknizer Logistics",
        email_body
    )
    
    return {"message": "Registration submitted. Please check your email to verify your address."}


@router.get("/verify-email")
def verify_email(
    token: str,
    email: str,
    db: Session = Depends(get_db)
):
    """Verify user's email address"""
    
    registration = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == email,
        RegistrationDBModel.verification_token == token,
        RegistrationDBModel.is_verified == False
    ).first()
    
    if not registration:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")
    
    registration.is_verified = True
    registration.verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully! The owner will review your registration."}