from typing import Optional
import random
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.registration import RegistrationRequest as RegistrationDBModel
from app.models.email_verification import EmailVerification

from app.core.security import verify_password, create_access_token, oauth2_scheme, get_password_hash
from app.core.dependencies import get_db, get_current_user, require_role
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse
from app.schemas.user import UserCreate, UserOut
from app.schemas.email_verification import SendCodeRequest, VerifyCodeRequest
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


@router.post("/send-verification-code")
async def send_verification_code(
    request_data: SendCodeRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Send a 6-digit OTP to verify an email address before registration"""
    
    existing_user = db.query(User).filter(User.email == request_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_registration = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status.in_(['approved', 'pending'])
    ).first()
    if existing_registration:
        raise HTTPException(status_code=400, detail="This email already has a registration on file")
    
    otp_code = f"{random.randint(0, 999999):06d}"
    expires_at = datetime.now() + timedelta(minutes=10)
    
    existing_verification = db.query(EmailVerification).filter(
        EmailVerification.email == request_data.email
    ).first()
    
    if existing_verification:
        existing_verification.customer_name = request_data.customer_name
        existing_verification.otp_code = otp_code
        existing_verification.otp_expires_at = expires_at
        existing_verification.attempts = 0
        existing_verification.verified = False
        existing_verification.verified_at = None
    else:
        existing_verification = EmailVerification(
            email=request_data.email,
            customer_name=request_data.customer_name,
            otp_code=otp_code,
            otp_expires_at=expires_at,
            attempts=0,
            verified=False
        )
        db.add(existing_verification)
    
    db.commit()
    
    email_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #f44336; color: white; padding: 20px; text-align: center; }}
            .code-box {{ background-color: #f8f8f8; border: 1px solid #ddd; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0; }}
            .code {{ font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f44336; }}
            .footer {{ margin-top: 30px; font-size: 12px; color: #666; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Your Verification Code</h2>
            </div>
            <p>Dear {request_data.customer_name},</p>
            <p>Use the code below to verify your email address and continue creating your account with <strong>Peaknizer Logistics</strong>:</p>
            <div class="code-box">
                <div class="code">{otp_code}</div>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this code, please ignore this email.</p>
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
        "Your Verification Code - Peaknizer Logistics",
        email_body
    )
    
    return {"message": "Verification code sent. Please check your email."}


@router.post("/verify-code")
def verify_code(
    request_data: VerifyCodeRequest,
    db: Session = Depends(get_db)
):
    """Verify the 6-digit code sent to the customer's email"""
    
    verification = db.query(EmailVerification).filter(
        EmailVerification.email == request_data.email
    ).first()
    
    if not verification:
        raise HTTPException(status_code=400, detail="No verification code found for this email. Please request a new code.")
    
    if verification.verified:
        return {"message": "Email already verified.", "verified": True}
    
    if verification.attempts >= 5:
        raise HTTPException(status_code=400, detail="Too many incorrect attempts. Please request a new code.")
    
    if datetime.now() > verification.otp_expires_at.replace(tzinfo=None):
        raise HTTPException(status_code=400, detail="Code expired. Please request a new code.")
    
    if request_data.code != verification.otp_code:
        verification.attempts += 1
        db.commit()
        remaining = 5 - verification.attempts
        raise HTTPException(status_code=400, detail=f"Incorrect code. {remaining} attempt(s) remaining.")
    
    verification.verified = True
    verification.verified_at = datetime.now()
    db.commit()
    
    return {"message": "Email verified successfully.", "verified": True}


@router.post("/register-request")
def register_request(
    request_data: RegistrationRequestSchema,
    db: Session = Depends(get_db)
):
    """Submit registration request — requires the email to already be OTP-verified"""
    
    existing_user = db.query(User).filter(User.email == request_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    existing_pending = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'pending'
    ).first()
    if existing_pending:
        raise HTTPException(status_code=400, detail="Registration already submitted. Awaiting approval.")
    
    existing_approved = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'approved'
    ).first()
    if existing_approved:
        raise HTTPException(status_code=400, detail="This email already has an approved registration")
    
    existing_declined = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'declined'
    ).first()
    if existing_declined:
        db.delete(existing_declined)
        db.commit()
    
    verification = db.query(EmailVerification).filter(
        EmailVerification.email == request_data.email,
        EmailVerification.verified == True
    ).first()
    
    if not verification:
        raise HTTPException(status_code=400, detail="Please verify your email before submitting the form.")
    
    if datetime.now() > verification.verified_at.replace(tzinfo=None) + timedelta(hours=1):
        raise HTTPException(status_code=400, detail="Verification expired. Please verify your email again.")
    
    hashed_password = get_password_hash(request_data.password)
    
    registration = RegistrationDBModel(
        customer_name=request_data.customer_name,
        email=request_data.email,
        phone=request_data.phone,
        company_name=request_data.company_name,
        company_address=request_data.company_address,
        password_hash=hashed_password,
        notes=request_data.notes,
        status='pending',
        is_verified=True,
        verification_token=None
    )
    
    db.add(registration)
    db.commit()
    
    return {"message": "Registration submitted successfully. The owner will review your request."}


@router.get("/verify-email")
def verify_email(
    token: str,
    email: str,
    db: Session = Depends(get_db)
):
    """Legacy link-based verification endpoint — no longer used by the current
    registration flow (replaced by OTP via /send-verification-code and
    /verify-code), kept here in case anything still references it."""
    
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

@router.post("/test-email")
async def test_email(
    email: str,
    db: Session = Depends(get_db)
):
    """Test email sending"""
    
    result = await EmailService.send_email(
        to_email=email,
        subject="Test Email from Peaknizer",
        body="<h1>Test</h1><p>This is a test email.</p>"
    )
    
    return {"success": result, "to": email}