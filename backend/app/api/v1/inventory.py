from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.core.dependencies import get_db, get_current_user, require_role
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.customer import Customer
from app.models.warehouse import Warehouse
from app.models.user import User  # Add this
from app.models.employee_customer import EmployeeCustomer
from app.models.employee_warehouse import EmployeeWarehouse
from app.models.customer_warehouse import CustomerWarehouse
from pydantic import BaseModel



router = APIRouter(prefix="/inventory", tags=["Inventory"])

# Updated Pydantic models to match database schema
class InventoryUpdate(BaseModel):
    units_received: int
    units_shipped: int

class InventoryResponse(BaseModel):
    product_id: UUID
    product_name: str
    sku: str
    batch_number: Optional[str] = None
    warehouses: dict  # warehouse_name -> {"received": units_received, "shipped": units_shipped, "left"}

class CustomerInventoryResponse(BaseModel):
    customer_id: UUID
    customer_name: str
    customer_code: str
    products: List[InventoryResponse]

@router.get("/customers", response_model=List[dict])
def get_customers_for_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get customers based on user role"""
    
    if current_user.role == 'owner':
        # Admin sees all customers
        customers = db.query(Customer).filter(
            Customer.company_id == current_user.company_id
        ).all()
        return [{"id": c.id, "name": c.customer_name, "code": c.customer_code} for c in customers]
    
    elif current_user.role == 'employee':
        # Employee sees only assigned customers
        assigned = db.query(EmployeeCustomer).filter(
            EmployeeCustomer.employee_id == current_user.id
        ).all()
        customer_ids = [a.customer_id for a in assigned]
        
        customers = db.query(Customer).filter(
            Customer.id.in_(customer_ids),
            Customer.company_id == current_user.company_id
        ).all()
        return [{"id": c.id, "name": c.customer_name, "code": c.customer_code} for c in customers]
    
    else:
        raise HTTPException(status_code=403, detail="Not authorized")



@router.get("/customer/{customer_id}", response_model=CustomerInventoryResponse)
def get_customer_inventory(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get inventory for a specific customer"""
    
    print(f"DEBUG: Getting inventory for customer {customer_id}")
    print(f"DEBUG: Current user role: {current_user.role}")
    
    # Check access
    if current_user.role == 'employee':
        # Verify employee has access to this customer
        assigned = db.query(EmployeeCustomer).filter(
            EmployeeCustomer.employee_id == current_user.id,
            EmployeeCustomer.customer_id == customer_id
        ).first()
        if not assigned:
            raise HTTPException(status_code=403, detail="No access to this customer")
    
    # Get customer
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    print(f"DEBUG: Found customer: {customer.customer_name}")
    
    # Get all products for this customer
    products = db.query(Product).filter(
        Product.customer_id == customer_id,
        Product.company_id == current_user.company_id
    ).all()
    
    print(f"DEBUG: Found {len(products)} products")
    
    # Get warehouses based on user role
    if current_user.role == 'owner':
        # Admin sees all warehouses assigned to this customer
        warehouse_assignments = db.query(CustomerWarehouse).filter(
            CustomerWarehouse.customer_id == customer_id
        ).all()
        warehouse_ids = [wa.warehouse_id for wa in warehouse_assignments]
        warehouses = db.query(Warehouse).filter(
            Warehouse.id.in_(warehouse_ids)
        ).all()
    else:
        # Employee sees only warehouses they have access to AND are assigned to this customer
        # Get warehouses assigned to employee
        employee_warehouses = db.query(EmployeeWarehouse).filter(
            EmployeeWarehouse.employee_id == current_user.id
        ).all()
        employee_warehouse_ids = [ew.warehouse_id for ew in employee_warehouses]
        
        # Get warehouses assigned to this customer
        customer_warehouses = db.query(CustomerWarehouse).filter(
            CustomerWarehouse.customer_id == customer_id
        ).all()
        customer_warehouse_ids = [cw.warehouse_id for cw in customer_warehouses]
        
        # Intersection - warehouses that are both assigned to employee AND this customer
        allowed_warehouse_ids = set(employee_warehouse_ids) & set(customer_warehouse_ids)
        
        warehouses = db.query(Warehouse).filter(
            Warehouse.id.in_(allowed_warehouse_ids)
        ).all()
    
    print(f"DEBUG: Found {len(warehouses)} warehouses for this user")
    warehouse_dict = {w.id: w.name for w in warehouses}
    print(f"DEBUG: Warehouse dict: {warehouse_dict}")
    
    # Build inventory response
    product_responses = []
    for product in products:
        print(f"DEBUG: Processing product {product.product_name} (ID: {product.id})")
        
        # Get inventory for this product across allowed warehouses
        inventory_items = db.query(Inventory).filter(
            Inventory.product_id == product.id,
            Inventory.warehouse_id.in_(warehouse_dict.keys())
        ).all()
        
        print(f"DEBUG: Found {len(inventory_items)} inventory records")
        
        # Create warehouse units dict with all three values
        warehouse_units = {}
        for inv in inventory_items:
            print(f"DEBUG: Inventory for warehouse {inv.warehouse_id}: received={inv.units_received}, shipped={inv.units_shipped}")
            warehouse_units[warehouse_dict[inv.warehouse_id]] = {
                "received": inv.units_received,
                "shipped": inv.units_shipped,
                "left": inv.units_received - inv.units_shipped
            }
        
        # Add zeros for allowed warehouses with no inventory yet
        for w_name in warehouse_dict.values():
            if w_name not in warehouse_units:
                print(f"DEBUG: No inventory for warehouse {w_name}, adding zeros")
                warehouse_units[w_name] = {"received": 0, "shipped": 0, "left": 0}
        
        product_responses.append(InventoryResponse(
            product_id=product.id,
            product_name=product.product_name,
            sku=product.sku,
            batch_number=product.batch_number,
            warehouses=warehouse_units
        ))
    
    print(f"DEBUG: Returning {len(product_responses)} products")
    
    return CustomerInventoryResponse(
        customer_id=customer.id,
        customer_name=customer.customer_name,
        customer_code=customer.customer_code,
        products=product_responses
    )


@router.put("/product/{product_id}/warehouse/{warehouse_id}", response_model=dict)
def update_inventory(
    product_id: UUID,
    warehouse_id: UUID,
    update: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update inventory units for a product in a specific warehouse"""
    
    print(f"====== INVENTORY UPDATE DEBUG ======")
    print(f"Product ID: {product_id}")
    print(f"Warehouse ID: {warehouse_id}")
    print(f"Update data: received={update.units_received}, shipped={update.units_shipped}")
    print(f"Current user: {current_user.id}, role: {current_user.role}")
    
    # Get product to verify access
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.company_id == current_user.company_id
    ).first()
    
    if not product:
        print(f"Product not found!")
        raise HTTPException(status_code=404, detail="Product not found")
    
    print(f"Found product: {product.product_name}, customer_id: {product.customer_id}")
    
    # Check if user has access
    if current_user.role == 'employee':
        print("Employee access check:")
        
        # Check customer access
        from app.models.employee_customer import EmployeeCustomer
        customer_access = db.query(EmployeeCustomer).filter(
            EmployeeCustomer.employee_id == current_user.id,
            EmployeeCustomer.customer_id == product.customer_id
        ).first()
        
        if not customer_access:
            print(f"No access to customer {product.customer_id}")
            raise HTTPException(status_code=403, detail="No access to this product's customer")
        else:
            print(f"Has access to customer {product.customer_id}")
        
        # Check warehouse access
        from app.models.employee_warehouse import EmployeeWarehouse
        warehouse_access = db.query(EmployeeWarehouse).filter(
            EmployeeWarehouse.employee_id == current_user.id,
            EmployeeWarehouse.warehouse_id == warehouse_id
        ).first()
        
        if not warehouse_access:
            print(f"No access to warehouse {warehouse_id}")
            raise HTTPException(status_code=403, detail="No access to this warehouse")
        else:
            print(f"Has access to warehouse {warehouse_id}")
    
    # Find or create inventory record
    inventory = db.query(Inventory).filter(
        Inventory.product_id == product_id,
        Inventory.warehouse_id == warehouse_id
    ).first()
    
    if inventory:
        print(f"Found existing inventory: received={inventory.units_received}, shipped={inventory.units_shipped}")
        inventory.units_received = update.units_received
        inventory.units_shipped = update.units_shipped
        print(f"Updated to: received={update.units_received}, shipped={update.units_shipped}")
    else:
        print(f"Creating new inventory record")
        inventory = Inventory(
            company_id=current_user.company_id,
            product_id=product_id,
            warehouse_id=warehouse_id,
            units_received=update.units_received,
            units_shipped=update.units_shipped
        )
        db.add(inventory)
    
    db.commit()
    print(f"Database commit successful")
    print(f"====== END DEBUG ======")
    
    return {
        "message": "Inventory updated successfully",
        "product_id": str(product_id),
        "warehouse_id": str(warehouse_id),
        "units_received": update.units_received,
        "units_shipped": update.units_shipped
    }