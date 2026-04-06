from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.dependencies import get_db, require_role, get_current_user
from app.models.customer import Customer
from app.models.user import User
from app.models.customer_warehouse import CustomerWarehouse
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerOut

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/", response_model=List[CustomerOut])
def get_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """Get all customers - accessible by owners and employees"""
    # Allow both owners and employees to view customers
    if current_user.role not in ['owner', 'employee']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    customers = db.query(Customer).filter(
        Customer.company_id == current_user.company_id
    ).offset(skip).limit(limit).all()
    
    # Add warehouse_ids to each customer
    for customer in customers:
        warehouse_assignments = db.query(CustomerWarehouse).filter(
            CustomerWarehouse.customer_id == customer.id
        ).all()
        customer.warehouse_ids = [wa.warehouse_id for wa in warehouse_assignments]
    
    return customers

@router.post("/", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Create customer - owner only"""
    # Create customer with company_id from current user
    customer_data = customer.dict(exclude={'warehouse_ids', 'password'})
    db_customer = Customer(
        **customer_data,
        company_id=current_user.company_id
    )
    
    db.add(db_customer)
    db.flush()
    
    # Add warehouse assignments
    warehouse_ids = customer.warehouse_ids or []
    for warehouse_id in warehouse_ids:
        assignment = CustomerWarehouse(
            customer_id=db_customer.id,
            warehouse_id=warehouse_id
        )
        db.add(assignment)
    
    # Create user account for customer if password is provided
    if customer.password:
        from app.core.security import get_password_hash
        from app.models.user import User
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == customer.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        # Create user
        hashed_password = get_password_hash(customer.password)
        db_user = User(
            company_id=current_user.company_id,
            email=customer.email,
            password_hash=hashed_password,
            full_name=customer.customer_name,
            role='customer',
            customer_id=db_customer.id,
            is_active=True
        )
        db.add(db_user)
    
    db.commit()
    db.refresh(db_customer)
    
    # Add warehouse_ids to response
    db_customer.warehouse_ids = warehouse_ids
    
    return db_customer

@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get single customer - accessible by owners and employees"""
    # Allow both owners and employees
    if current_user.role not in ['owner', 'employee']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Get warehouse assignments
    warehouse_assignments = db.query(CustomerWarehouse).filter(
        CustomerWarehouse.customer_id == customer_id
    ).all()
    customer.warehouse_ids = [wa.warehouse_id for wa in warehouse_assignments]
    
    return customer

@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: UUID,
    customer_update: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Update customer - owner only"""
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Update customer fields
    update_data = customer_update.dict(exclude_unset=True, exclude={'warehouse_ids'})
    for key, value in update_data.items():
        setattr(customer, key, value)
    
    # Update warehouse assignments if provided
    if customer_update.warehouse_ids is not None:
        # Delete existing assignments
        db.query(CustomerWarehouse).filter(
            CustomerWarehouse.customer_id == customer_id
        ).delete()
        
        # Add new assignments
        for warehouse_id in customer_update.warehouse_ids:
            assignment = CustomerWarehouse(
                customer_id=customer_id,
                warehouse_id=warehouse_id
            )
            db.add(assignment)
    
    db.commit()
    db.refresh(customer)
    
    # Get updated warehouse assignments
    warehouse_assignments = db.query(CustomerWarehouse).filter(
        CustomerWarehouse.customer_id == customer_id
    ).all()
    customer.warehouse_ids = [wa.warehouse_id for wa in warehouse_assignments]
    
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Delete customer - owner only"""
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Check for related records and delete them first
    from app.models.excel_batch import ExcelBatch
    from app.models.excel_batch_row import ExcelBatchRow
    from app.models.invoice import Invoice
    from app.models.product import Product
    from app.models.user import User
    from app.models.registration import RegistrationRequest
    
    # Get all batches for this customer
    batches = db.query(ExcelBatch).filter(ExcelBatch.customer_id == customer_id).all()
    
    for batch in batches:
        # Delete batch rows
        db.query(ExcelBatchRow).filter(ExcelBatchRow.batch_id == batch.id).delete()
    
    # Delete batches
    db.query(ExcelBatch).filter(ExcelBatch.customer_id == customer_id).delete()
    
    # Delete products
    db.query(Product).filter(Product.customer_id == customer_id).delete()
    
    # Delete invoices (shipping_details will cascade)
    db.query(Invoice).filter(Invoice.customer_id == customer_id).delete()
    
    # ⬇️⬇️⬇️ ADD THESE TWO LINES ⬇️⬇️⬇️
    
    # Delete user account associated with this customer
    db.query(User).filter(User.email == customer.email).delete()
    
    # Delete any registration requests for this email
    db.query(RegistrationRequest).filter(RegistrationRequest.email == customer.email).delete()
    
    # Finally delete the customer
    db.delete(customer)
    db.commit()
    
    return None

