from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.core.dependencies import get_db, require_role
from app.models.invoice import Invoice
from app.models.user import User
from app.schemas.invoice import InvoiceOut
from app.services.pdf_service import PDFService
from app.services.invoice_service import InvoiceService
from app.models.customer import Customer  
from app.models.shipping_detail import ShippingDetail  
from app.models.excel_batch_row import ExcelBatchRow  

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.put("/{invoice_id}/visibility", status_code=status.HTTP_200_OK)
def toggle_invoice_visibility(
    invoice_id: UUID,
    visible: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Toggle invoice visibility for customer"""
    
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.company_id == current_user.company_id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice.is_visible_to_customer = visible
    db.commit()
    
    return {"message": f"Invoice visibility set to {visible}", "invoice_id": str(invoice_id)}

@router.put("/{invoice_id}/status", response_model=InvoiceOut)
def update_invoice_status(
    invoice_id: UUID,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Owner manually updates invoice status"""
    
    # Validate status
    valid_statuses = ['unpaid', 'partially_paid', 'fully_paid']
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {valid_statuses}")
    
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.company_id == current_user.company_id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice.status = status
    db.commit()
    db.refresh(invoice)
    
    return invoice

@router.get("/", response_model=List[InvoiceOut])
def get_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner")),
    customer_id: Optional[UUID] = None,
    status: Optional[str] = None,  # ← ADD THIS LINE
    skip: int = 0,
    limit: int = 100
):
    """Get all invoices (owner only)"""
    
    query = db.query(Invoice).filter(Invoice.company_id == current_user.company_id)
    
    if customer_id:
        query = query.filter(Invoice.customer_id == customer_id)
    
    # ← ADD THIS STATUS FILTER
    if status:
        query = query.filter(Invoice.status == status)
    
    invoices = query.order_by(Invoice.issue_date.desc()).offset(skip).limit(limit).all()
    return invoices

@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Get single invoice"""
    
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.company_id == current_user.company_id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    return invoice


@router.post("/{invoice_id}/regenerate-pdf", response_model=dict)
def regenerate_invoice_pdf(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Regenerate PDF for an invoice"""
    
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.company_id == current_user.company_id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Get customer details
    customer = db.query(Customer).filter(
        Customer.id == invoice.customer_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Get shipping details and batch rows
    shipping_detail = db.query(ShippingDetail).filter(
        ShippingDetail.id == invoice.shipping_details_id
    ).first()
    
    rows = []
    if shipping_detail:
        batch_rows = db.query(ExcelBatchRow).filter(
            ExcelBatchRow.batch_id == shipping_detail.batch_id
        ).all()
        
        rows = [{
            'tracking_number': r.tracking_number,
            'label_cost': float(r.label_cost),
            'end_customer_name': r.end_customer_name,
            'order_number': r.order_number,
            'date': r.date.strftime('%Y-%m-%d')
        } for r in batch_rows]
    
    # Prepare invoice data
    invoice_data = {
        'invoice_number': invoice.invoice_number,
        'invoice_type': invoice.invoice_type,
        'customer_name': customer.customer_name,
        'customer_code': customer.customer_code,
        'issue_date': invoice.issue_date.strftime('%Y-%m-%d'),
        'due_date': invoice.due_date.strftime('%Y-%m-%d'),
        'status': invoice.status,
        'total_amount': float(invoice.total_amount),
        'quantity': invoice.quantity,
        'rate': float(invoice.rate) if invoice.rate else None
    }
    
    # Generate PDF
    pdf_service = PDFService()
    pdf_path = pdf_service.generate_invoice_pdf(invoice_data, rows if invoice.invoice_type == 'shipping' else None)
    
    # Update invoice with PDF path
    invoice.pdf_url = pdf_path
    db.commit()
    
    return {
        "message": "PDF regenerated successfully",
        "invoice_id": str(invoice_id),
        "pdf_url": pdf_path
    }