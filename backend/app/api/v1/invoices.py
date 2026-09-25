from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Response
from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
from typing import List, Optional
from uuid import UUID

from app.core.dependencies import get_db, require_role
from app.models.invoice import Invoice
from app.models.user import User
from app.schemas.invoice import InvoiceOut, CustomerInvoiceSummaryOut
from app.services.pdf_service import PDFService
from app.services.invoice_service import InvoiceService
from app.services.email_service import EmailService
from app.models.customer import Customer  
from app.models.shipping_detail import ShippingDetail  
from app.models.excel_batch import ExcelBatch
from app.models.excel_batch_row import ExcelBatchRow  

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.put("/{invoice_id}/visibility", status_code=status.HTTP_200_OK)
def toggle_invoice_visibility(
    invoice_id: UUID,
    visible: bool,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Toggle invoice visibility for customer. Going from Hidden -> Visible
    sends the customer an email notification with the invoice PDF attached."""
    
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.company_id == current_user.company_id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    was_visible = invoice.is_visible_to_customer
    invoice.is_visible_to_customer = visible
    db.commit()
    
    if visible and not was_visible:
        customer = db.query(Customer).filter(
            Customer.id == invoice.customer_id
        ).first()
        
        if customer and customer.email and invoice.pdf_url:
            email_body = EmailService.get_invoice_notification_email_template(
                customer_name=customer.customer_name,
                invoice_number=invoice.invoice_number,
                invoice_type=invoice.invoice_type,
                total_amount=f"${float(invoice.total_amount):.2f}",
                due_date=invoice.due_date.strftime('%Y-%m-%d')
            )
            
            attachment_filename = f"Invoice_{invoice.invoice_number}.pdf"
            
            background_tasks.add_task(
                EmailService.send_email,
                customer.email,
                f"New Invoice Available - {invoice.invoice_number}",
                email_body,
                invoice.pdf_url,
                attachment_filename
            )
    
    return {"message": f"Invoice visibility set to {visible}", "invoice_id": str(invoice_id)}

@router.put("/{invoice_id}/status", response_model=InvoiceOut)
def update_invoice_status(
    invoice_id: UUID,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Owner manually updates invoice status"""
    
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

@router.get("/customer-summary", response_model=List[CustomerInvoiceSummaryOut])
def get_customer_invoice_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Per-customer invoice counts/balances, computed entirely in SQL so
    load time stays flat regardless of total invoice count. 'Paid' means
    status is partially_paid or fully_paid. The two balance figures only
    include status='unpaid' invoices, since partial payment amounts
    aren't tracked separately in the schema."""
    
    rows = db.query(
        Customer.id.label('customer_id'),
        Customer.customer_name.label('customer_name'),
        Customer.customer_code.label('customer_code'),
        func.coalesce(func.count(Invoice.id), 0).label('total_count'),
        func.coalesce(func.sum(case((Invoice.invoice_type == 'shipping', 1), else_=0)), 0).label('shipping_count'),
        func.coalesce(func.sum(case((Invoice.invoice_type == 'prep', 1), else_=0)), 0).label('prep_count'),
        func.coalesce(func.sum(case((Invoice.status != 'unpaid', 1), else_=0)), 0).label('paid_count'),
        func.coalesce(func.sum(case((Invoice.status == 'unpaid', 1), else_=0)), 0).label('unpaid_count'),
        func.coalesce(func.sum(case(
            (and_(Invoice.invoice_type == 'shipping', Invoice.status == 'unpaid'), Invoice.total_amount),
            else_=0
        )), 0).label('shipping_unpaid_balance'),
        func.coalesce(func.sum(case(
            (and_(Invoice.invoice_type == 'prep', Invoice.status == 'unpaid'), Invoice.total_amount),
            else_=0
        )), 0).label('prep_unpaid_balance'),
    ).select_from(Customer).outerjoin(
        Invoice,
        and_(Invoice.customer_id == Customer.id, Invoice.company_id == current_user.company_id)
    ).filter(
        Customer.company_id == current_user.company_id
    ).group_by(
        Customer.id, Customer.customer_name, Customer.customer_code
    ).order_by(Customer.customer_name).all()
    
    return rows

@router.get("/", response_model=List[InvoiceOut])
def get_invoices(
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner")),
    customer_id: Optional[UUID] = None,
    status: Optional[str] = None,
    invoice_type: Optional[str] = None,
    paid: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50
):
    """Get invoices (owner only), paginated. Customer name/code and batch
    info are joined in with a few targeted queries scoped to just this
    page's invoices."""
    
    query = db.query(Invoice).filter(Invoice.company_id == current_user.company_id)
    
    if customer_id:
        query = query.filter(Invoice.customer_id == customer_id)
    if status:
        query = query.filter(Invoice.status == status)
    if invoice_type:
        query = query.filter(Invoice.invoice_type == invoice_type)
    if paid is True:
        query = query.filter(Invoice.status != 'unpaid')
    elif paid is False:
        query = query.filter(Invoice.status == 'unpaid')
    
    total_count = query.count()
    response.headers["X-Total-Count"] = str(total_count)
    
    invoices = query.order_by(Invoice.issue_date.desc()).offset(skip).limit(limit).all()
    
    if not invoices:
        return invoices
    
    customer_ids = {inv.customer_id for inv in invoices}
    shipping_ids = {inv.shipping_details_id for inv in invoices}
    
    customers = db.query(Customer).filter(Customer.id.in_(customer_ids)).all()
    customer_map = {c.id: c for c in customers}
    
    shipping_details = db.query(ShippingDetail).filter(ShippingDetail.id.in_(shipping_ids)).all()
    shipping_map = {s.id: s for s in shipping_details}
    
    batch_ids = {s.batch_id for s in shipping_details if s.batch_id}
    batches = db.query(ExcelBatch).filter(ExcelBatch.id.in_(batch_ids)).all() if batch_ids else []
    batch_map = {b.id: b for b in batches}
    
    for inv in invoices:
        customer = customer_map.get(inv.customer_id)
        inv.customer_name = customer.customer_name if customer else None
        inv.customer_code = customer.customer_code if customer else None
        
        shipping_detail = shipping_map.get(inv.shipping_details_id)
        batch = batch_map.get(shipping_detail.batch_id) if shipping_detail else None
        inv.batch_id = batch.id if batch else None
        inv.batch_upload_date = batch.upload_date if batch else None
    
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
    
    customer = db.query(Customer).filter(
        Customer.id == invoice.customer_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
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
    
    pdf_service = PDFService()
    pdf_path = pdf_service.generate_invoice_pdf(invoice_data, rows if invoice.invoice_type == 'shipping' else None)
    
    invoice.pdf_url = pdf_path
    db.commit()
    
    return {
        "message": "PDF regenerated successfully",
        "invoice_id": str(invoice_id),
        "pdf_url": pdf_path
    }