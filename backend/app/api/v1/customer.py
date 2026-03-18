from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from fastapi.responses import FileResponse
from app.models.user import User
import os
from app.core.dependencies import get_db, get_current_user
from app.models.invoice import Invoice
from app.models.shipping_detail import ShippingDetail
from app.models.customer import Customer
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.warehouse import Warehouse
from app.schemas.invoice import InvoiceOut
from app.schemas.shipping_detail import ShippingDetailOut
from app.models.customer_warehouse import CustomerWarehouse  
from app.models.payment_proof import PaymentProof  

router = APIRouter(prefix="/customer", tags=["Customer Portal"])

@router.get("/dashboard")
def get_customer_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Customer dashboard summary"""
    
    print(f"Dashboard accessed by user: {current_user.id}, role: {current_user.role}")
    
    if current_user.role != 'customer':
        raise HTTPException(status_code=403, detail="Customer access only")
    
    print(f"Customer ID from user: {current_user.customer_id}")
    
    # Get customer details
    customer = db.query(Customer).filter(
        Customer.id == current_user.customer_id
    ).first()
    
    if not customer:
        print(f"Customer not found for ID: {current_user.customer_id}")
        return {
            "customer_name": "Customer",
            "customer_code": "N/A",
            "total_inventory": 0,
            "total_outstanding": 0.0,
            "visible_shipping_invoices": 0,
            "visible_prep_invoices": 0,
            "visible_shipping_details": 0,
            "prep_rate": 5.5
        }
    
    print(f"Found customer: {customer.customer_name}")
    
    # Get invoice summary
    invoices = db.query(Invoice).filter(
        Invoice.customer_id == current_user.customer_id,
        Invoice.is_visible_to_customer == True
    ).all()
    
    total_outstanding = sum(
        inv.total_amount for inv in invoices 
        if inv.status in ['unpaid', 'partially_paid']
    )
    
    # Calculate total inventory (sum of units_left across all products)
    products = db.query(Product).filter(
        Product.customer_id == current_user.customer_id,
        Product.is_active == True
    ).all()
    
    total_inventory = 0
    for product in products:
        inventory_items = db.query(Inventory).filter(
            Inventory.product_id == product.id
        ).all()
        for inv in inventory_items:
            # Calculate units_left manually
            units_left = inv.units_received - inv.units_shipped
            total_inventory += units_left
    
    # Get counts
    shipping_invoices_count = db.query(Invoice).filter(
        Invoice.customer_id == current_user.customer_id,
        Invoice.is_visible_to_customer == True,
        Invoice.invoice_type == 'shipping'
    ).count()
    
    prep_invoices_count = db.query(Invoice).filter(
        Invoice.customer_id == current_user.customer_id,
        Invoice.is_visible_to_customer == True,
        Invoice.invoice_type == 'prep'
    ).count()
    
    shipping_details_count = db.query(ShippingDetail).filter(
        ShippingDetail.customer_id == current_user.customer_id,
        ShippingDetail.is_visible_to_customer == True
    ).count()
    
    return {
        "customer_name": customer.customer_name,
        "customer_code": customer.customer_code,
        "total_inventory": total_inventory,
        "total_outstanding": float(total_outstanding),
        "visible_shipping_invoices": shipping_invoices_count,
        "visible_prep_invoices": prep_invoices_count,
        "visible_shipping_details": shipping_details_count,
        "prep_rate": float(customer.prep_rate)
    }

@router.get("/proofs")
def get_customer_proofs(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get customer's uploaded payment proofs"""
    
    if current_user.role != 'customer':
        raise HTTPException(status_code=403, detail="Customer access only")
    
    proofs = db.query(PaymentProof).filter(
        PaymentProof.uploaded_by == current_user.id
    ).order_by(PaymentProof.uploaded_at.desc()).all()
    
    result = []
    for proof in proofs:
        invoice = db.query(Invoice).filter(
            Invoice.id == proof.invoice_id
        ).first()
        
        proof_data = {
            "id": proof.id,
            "invoice_number": invoice.invoice_number if invoice else "Unknown",
            "file_url": proof.file_url,
            "uploaded_at": proof.uploaded_at,
            "verified": proof.verified,
            "verified_at": proof.verified_at
        }
        result.append(proof_data)
    
    return result

@router.get("/invoices/prep")
def get_customer_prep_invoices(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get customer's visible prep invoices"""
    
    if current_user.role != 'customer':
        raise HTTPException(status_code=403, detail="Customer access only")
    
    invoices = db.query(Invoice).filter(
        Invoice.customer_id == current_user.customer_id,
        Invoice.is_visible_to_customer == True,
        Invoice.invoice_type == 'prep'
    ).order_by(Invoice.issue_date.desc()).all()
    
    # Add shipping details info to each invoice
    result = []
    for invoice in invoices:
        shipping_detail = db.query(ShippingDetail).filter(
            ShippingDetail.id == invoice.shipping_details_id
        ).first()
        
        invoice_data = {
            "id": invoice.id,
            "invoice_number": invoice.invoice_number,
            "issue_date": invoice.issue_date,
            "due_date": invoice.due_date,
            "total_amount": float(invoice.total_amount),
            "status": invoice.status,
            "pdf_url": invoice.pdf_url,
            "shipping_detail_id": shipping_detail.id if shipping_detail else None,
            "has_excel": shipping_detail and shipping_detail.excel_file_url is not None,
            "has_pdf": shipping_detail and shipping_detail.pdf_file_url is not None,
            "quantity": invoice.quantity,  # Number of tracking numbers
            "total_quantity": invoice.total_quantity,  # Sum of quantities
            "total_prep_value": float(invoice.total_prep_value) if invoice.total_prep_value else None,
            "discount_percentage": invoice.discount_percentage,
            "rate": float(invoice.rate) if invoice.rate else None
        }
        result.append(invoice_data)
    
    return result

@router.get("/invoices/shipping")
def get_customer_shipping_invoices(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get customer's visible shipping invoices"""
    
    if current_user.role != 'customer':
        raise HTTPException(status_code=403, detail="Customer access only")
    
    invoices = db.query(Invoice).filter(
        Invoice.customer_id == current_user.customer_id,
        Invoice.is_visible_to_customer == True,
        Invoice.invoice_type == 'shipping'
    ).order_by(Invoice.issue_date.desc()).all()
    
    # Add shipping details info to each invoice
    result = []
    for invoice in invoices:
        shipping_detail = db.query(ShippingDetail).filter(
            ShippingDetail.id == invoice.shipping_details_id
        ).first()
        
        invoice_data = {
            "id": invoice.id,
            "invoice_number": invoice.invoice_number,
            "issue_date": invoice.issue_date,
            "due_date": invoice.due_date,
            "total_amount": float(invoice.total_amount),
            "status": invoice.status,
            "pdf_url": invoice.pdf_url,
            "shipping_detail_id": shipping_detail.id if shipping_detail else None,
            "has_excel": shipping_detail and shipping_detail.excel_file_url is not None,
            "has_pdf": shipping_detail and shipping_detail.pdf_file_url is not None
        }
        result.append(invoice_data)
    
    return result

@router.get("/downloads/invoice/{invoice_id}")
def customer_download_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Customer downloads their invoice PDF"""
    
    if current_user.role != 'customer':
        raise HTTPException(status_code=403, detail="Customer access only")
    
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.customer_id == current_user.customer_id,
        Invoice.is_visible_to_customer == True
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found or not visible")
    
    if not invoice.pdf_url or not os.path.exists(invoice.pdf_url):
        raise HTTPException(status_code=404, detail="PDF file not found")
    
    filename = f"invoice_{invoice.invoice_number}.pdf"
    
    return FileResponse(
        path=invoice.pdf_url,
        media_type='application/pdf',
        filename=filename
    )

@router.get("/inventory")
def get_customer_inventory(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get customer's inventory (read-only)"""
    
    if current_user.role != 'customer':
        raise HTTPException(status_code=403, detail="Customer access only")
    
    # Get customer's products
    products = db.query(Product).filter(
        Product.customer_id == current_user.customer_id,
        Product.is_active == True
    ).all()
    
    # Get warehouses assigned to this customer
    warehouse_assignments = db.query(CustomerWarehouse).filter(
        CustomerWarehouse.customer_id == current_user.customer_id
    ).all()
    warehouse_ids = [wa.warehouse_id for wa in warehouse_assignments]
    
    warehouses = db.query(Warehouse).filter(
        Warehouse.id.in_(warehouse_ids)
    ).all()
    warehouse_dict = {w.id: w.name for w in warehouses}
    
    result = []
    for product in products:
        product_data = {
            "product_id": product.id,
            "product_name": product.product_name,
            "sku": product.sku,
            "batch_number": product.batch_number,
            "warehouses": {}
        }
        
        # Get inventory for each warehouse
        for warehouse_id in warehouse_ids:
            inventory = db.query(Inventory).filter(
                Inventory.product_id == product.id,
                Inventory.warehouse_id == warehouse_id
            ).first()
            
            if inventory:
                units_left = inventory.units_received - inventory.units_shipped
                product_data["warehouses"][warehouse_dict[warehouse_id]] = units_left
            else:
                product_data["warehouses"][warehouse_dict[warehouse_id]] = 0
        
        result.append(product_data)
    
    return result