from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.core.dependencies import get_db, get_current_user, require_role
from app.models.product import Product
from app.models.customer import Customer
from app.models.user import User  # Add this
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=List[ProductOut])
def get_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # Changed from require_role("owner")
    customer_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get products - accessible by owners and employees"""
    if current_user.role not in ['owner', 'employee']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    query = db.query(Product).filter(Product.company_id == current_user.company_id)
    
    if customer_id:
        # If employee, check if they have access to this customer
        if current_user.role == 'employee':
            from app.models.employee_customer import EmployeeCustomer
            has_access = db.query(EmployeeCustomer).filter(
                EmployeeCustomer.employee_id == current_user.id,
                EmployeeCustomer.customer_id == customer_id
            ).first()
            
            if not has_access:
                raise HTTPException(status_code=403, detail="No access to this customer")
        
        query = query.filter(Product.customer_id == customer_id)
    
    products = query.offset(skip).limit(limit).all()
    return products

@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Changed from require_role("owner")
):
    """Create product - accessible by owners and employees with proper permissions"""
    
    # Verify customer belongs to this company
    from app.models.customer import Customer
    customer = db.query(Customer).filter(
        Customer.id == product.customer_id,
        Customer.company_id == current_user.company_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # If employee, check if they have access to this customer
    if current_user.role == 'employee':
        from app.models.employee_customer import EmployeeCustomer
        has_access = db.query(EmployeeCustomer).filter(
            EmployeeCustomer.employee_id == current_user.id,
            EmployeeCustomer.customer_id == product.customer_id
        ).first()
        
        if not has_access:
            raise HTTPException(status_code=403, detail="No access to this customer")
    
    product_data = product.dict()
    db_product = Product(
        **product_data,
        company_id=current_user.company_id
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/{product_id}", response_model=ProductOut)
def get_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Changed from require_role("owner")
):
    """Get single product - accessible by owners and employees"""
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.company_id == current_user.company_id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # If employee, check if they have access to this product's customer
    if current_user.role == 'employee':
        from app.models.employee_customer import EmployeeCustomer
        has_access = db.query(EmployeeCustomer).filter(
            EmployeeCustomer.employee_id == current_user.id,
            EmployeeCustomer.customer_id == product.customer_id
        ).first()
        
        if not has_access:
            raise HTTPException(status_code=403, detail="No access to this product")
    
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: UUID,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Changed from require_role("owner")
):
    """Update product - accessible by owners and employees with proper permissions"""
    
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.company_id == current_user.company_id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # If employee, check if they have access to this product's customer
    if current_user.role == 'employee':
        from app.models.employee_customer import EmployeeCustomer
        has_access = db.query(EmployeeCustomer).filter(
            EmployeeCustomer.employee_id == current_user.id,
            EmployeeCustomer.customer_id == product.customer_id
        ).first()
        
        if not has_access:
            raise HTTPException(status_code=403, detail="No access to this product")
    
    for key, value in product_update.dict(exclude_unset=True).items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_role("owner"))
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.company_id == current_user.company_id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return None
