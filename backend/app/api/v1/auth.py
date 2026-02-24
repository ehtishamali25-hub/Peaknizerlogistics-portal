from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.models.registration import RegistrationRequest as RegistrationDBModel  # Rename import

from app.core.security import verify_password, create_access_token, oauth2_scheme, get_password_hash
from app.core.dependencies import get_db, get_current_user, require_role
from app.core.config import settings
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse
from app.schemas.user import UserCreate, UserOut
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegistrationRequestSchema(BaseModel):  # Rename this class
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
    
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user - exclude password from dict and add hashed password
    user_dict = user_data.dict(exclude={'password', 'customer_ids', 'warehouse_ids'})
    db_user = User(
        **user_dict,
        password_hash=hashed_password
    )
    
    db.add(db_user)
    db.flush()  # Get ID without committing
    
    # Add customer assignments
    from app.models.employee_customer import EmployeeCustomer
    for customer_id in user_data.customer_ids:
        assignment = EmployeeCustomer(
            employee_id=db_user.id,
            customer_id=customer_id
        )
        db.add(assignment)
    
    # Add warehouse assignments
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
    db: Session = Depends(get_db)
):
    """Submit registration request"""
    
    # Check if email already exists in users (active accounts)
    existing_user = db.query(User).filter(User.email == request_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if there's already a PENDING request (not declined or approved)
    existing_pending = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'pending'
    ).first()
    
    if existing_pending:
        raise HTTPException(status_code=400, detail="You already have a pending registration request")
    
    # Check if there's an approved request (shouldn't happen if user doesn't exist, but check anyway)
    existing_approved = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'approved'
    ).first()
    
    if existing_approved:
        raise HTTPException(status_code=400, detail="This email already has an approved registration")
    
    # If there's a declined request, we can either:
    # Option 1: Allow re-registration by updating the existing record
    # Option 2: Delete the old declined record and create new
    
    # Let's go with Option 2 - delete old declined record
    existing_declined = db.query(RegistrationDBModel).filter(
        RegistrationDBModel.email == request_data.email,
        RegistrationDBModel.status == 'declined'
    ).first()
    
    if existing_declined:
        # Delete the old declined request
        db.delete(existing_declined)
        db.commit()
        print(f"Deleted old declined request for {request_data.email}")
    
    # Hash password
    from app.core.security import get_password_hash
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
        status='pending'
    )
    
    db.add(registration)
    db.commit()
    
    return {"message": "Registration request submitted successfully"}