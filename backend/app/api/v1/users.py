from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from pydantic import BaseModel

from app.core.dependencies import get_db, require_role, get_current_user
from app.models.user import User
from app.models.customer import Customer
from app.models.warehouse import Warehouse
from app.schemas.user import UserOut

# Pydantic models for requests
class EmployeeAssignmentsUpdate(BaseModel):
    customer_ids: List[UUID] = []
    warehouse_ids: List[UUID] = []

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[UserOut])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner")),
    skip: int = 0,
    limit: int = 100
):
    """Get all users - owners only"""
    users = db.query(User).filter(
        User.company_id == current_user.company_id
    ).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Get single user - owners only"""
    user = db.query(User).filter(
        User.id == user_id,
        User.company_id == current_user.company_id
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# NEW ENDPOINT 1: Get employee assignments

@router.get("/{user_id}/assignments", response_model=dict)
def get_user_assignments(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Changed from require_role("owner")
):
    """Get user assignments - users can view their own, owners can view any"""
    
    # Check permissions
    if current_user.role != 'owner' and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's assignments")
    
    user = db.query(User).filter(
        User.id == user_id,
        User.company_id == current_user.company_id
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get assigned customer IDs
    from app.models.employee_customer import EmployeeCustomer
    assigned_customers = db.query(EmployeeCustomer).filter(
        EmployeeCustomer.employee_id == user_id
    ).all()
    customer_ids = [ac.customer_id for ac in assigned_customers]
    
    # Get assigned warehouse IDs
    from app.models.employee_warehouse import EmployeeWarehouse
    assigned_warehouses = db.query(EmployeeWarehouse).filter(
        EmployeeWarehouse.employee_id == user_id
    ).all()
    warehouse_ids = [aw.warehouse_id for aw in assigned_warehouses]
    
    return {
        "user_id": user_id,
        "customer_ids": customer_ids,
        "warehouse_ids": warehouse_ids
    }

# NEW ENDPOINT 2: Update employee assignments
@router.put("/{user_id}/assignments", response_model=dict)
def update_user_assignments(
    user_id: UUID,
    assignments: EmployeeAssignmentsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Update employee assignments (customers and warehouses)"""
    
    user = db.query(User).filter(
        User.id == user_id,
        User.company_id == current_user.company_id,
        User.role == 'employee'
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    from app.models.employee_customer import EmployeeCustomer
    from app.models.employee_warehouse import EmployeeWarehouse
    
    # Delete existing customer assignments
    db.query(EmployeeCustomer).filter(
        EmployeeCustomer.employee_id == user_id
    ).delete()
    
    # Delete existing warehouse assignments
    db.query(EmployeeWarehouse).filter(
        EmployeeWarehouse.employee_id == user_id
    ).delete()
    
    # Add new customer assignments
    for customer_id in assignments.customer_ids:
        # Verify customer exists and belongs to company
        customer = db.query(Customer).filter(
            Customer.id == customer_id,
            Customer.company_id == current_user.company_id
        ).first()
        
        if customer:
            assignment = EmployeeCustomer(
                employee_id=user_id,
                customer_id=customer_id
            )
            db.add(assignment)
    
    # Add new warehouse assignments
    for warehouse_id in assignments.warehouse_ids:
        # Verify warehouse exists and belongs to company
        warehouse = db.query(Warehouse).filter(
            Warehouse.id == warehouse_id,
            Warehouse.company_id == current_user.company_id
        ).first()
        
        if warehouse:
            assignment = EmployeeWarehouse(
                employee_id=user_id,
                warehouse_id=warehouse_id
            )
            db.add(assignment)
    
    db.commit()
    
    return {
        "message": "Assignments updated successfully",
        "user_id": user_id,
        "customer_ids": assignments.customer_ids,
        "warehouse_ids": assignments.warehouse_ids
    }

# NEW ENDPOINT 3: Toggle employee active status
@router.put("/{user_id}/toggle-status", response_model=dict)
def toggle_user_status(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Toggle employee active status"""
    
    user = db.query(User).filter(
        User.id == user_id,
        User.company_id == current_user.company_id,
        User.role == 'employee'
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    user.is_active = not user.is_active
    db.commit()
    
    return {
        "message": f"Employee {'activated' if user.is_active else 'deactivated'} successfully",
        "user_id": user_id,
        "is_active": user.is_active
    }

# NEW ENDPOINT 4: Reset employee password
@router.put("/{user_id}/reset-password", response_model=dict)
def reset_user_password(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Reset employee password to default (password123)"""
    
    user = db.query(User).filter(
        User.id == user_id,
        User.company_id == current_user.company_id,
        User.role == 'employee'
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    from app.core.security import get_password_hash
    default_password = "password123"
    user.password_hash = get_password_hash(default_password)
    
    db.commit()
    
    return {
        "message": "Password reset successfully to default",
        "user_id": user_id
    }