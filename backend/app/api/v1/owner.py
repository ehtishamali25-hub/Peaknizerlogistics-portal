from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List
from uuid import UUID

from app.core.dependencies import get_db, require_role
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.user import User

router = APIRouter(prefix="/owner", tags=["Owner"])

@router.get("/customer-summary")
def get_customer_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Get summary of all customers with unpaid amounts and total inventory"""
    
    customers = db.query(Customer).filter(
        Customer.company_id == current_user.company_id
    ).all()
    
    result = []
    for customer in customers:
        # Get unpaid shipping invoices
        shipping_unpaid = db.query(func.sum(Invoice.total_amount)).filter(
            Invoice.customer_id == customer.id,
            Invoice.invoice_type == 'shipping',
            Invoice.status.in_(['unpaid', 'partially_paid'])
        ).scalar() or 0
        
        # Get unpaid prep invoices
        prep_unpaid = db.query(func.sum(Invoice.total_amount)).filter(
            Invoice.customer_id == customer.id,
            Invoice.invoice_type == 'prep',
            Invoice.status.in_(['unpaid', 'partially_paid'])
        ).scalar() or 0
        
        # Calculate total inventory
        products = db.query(Product).filter(
            Product.customer_id == customer.id,
            Product.is_active == True
        ).all()
        
        total_inventory = 0
        for product in products:
            inventory_items = db.query(Inventory).filter(
                Inventory.product_id == product.id
            ).all()
            for inv in inventory_items:
                total_inventory += (inv.units_received - inv.units_shipped)
        
        result.append({
            "customer_id": str(customer.id),
            "customer_name": customer.customer_name,
            "customer_code": customer.customer_code,
            "shipping_unpaid": float(shipping_unpaid),
            "prep_unpaid": float(prep_unpaid),
            "total_unpaid": float(shipping_unpaid + prep_unpaid),
            "total_inventory": total_inventory
        })
    
    return result