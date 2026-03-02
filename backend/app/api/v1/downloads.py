from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from uuid import UUID
import os

from app.core.dependencies import get_db, get_current_user
from app.models.invoice import Invoice
from app.models.shipping_detail import ShippingDetail
from app.models.user import User

router = APIRouter(prefix="/downloads", tags=["Downloads"])

@router.get("/invoice/{invoice_id}")
async def download_invoice_pdf(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download invoice PDF (owners and customers can download)"""
    
    # Different query for customers vs owners
    if current_user.role == 'customer':
        invoice = db.query(Invoice).filter(
            Invoice.id == invoice_id,
            Invoice.customer_id == current_user.customer_id,
            Invoice.company_id == current_user.company_id
        ).first()
    else:
        invoice = db.query(Invoice).filter(
            Invoice.id == invoice_id,
            Invoice.company_id == current_user.company_id
        ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Check visibility for customers (already filtered by customer_id, but double-check visibility)
    if current_user.role == 'customer':
        if not invoice.is_visible_to_customer:
            raise HTTPException(status_code=403, detail="Invoice not visible")
    
    if not invoice.pdf_url or not os.path.exists(invoice.pdf_url):
        raise HTTPException(status_code=404, detail="PDF file not found")
    
    return FileResponse(
        invoice.pdf_url,
        media_type='application/pdf',
        filename=f"invoice_{invoice.invoice_number}.pdf"
    )

@router.get("/shipping-details/{shipping_detail_id}/excel")
async def download_shipping_excel(
    shipping_detail_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download shipping details Excel (owners and customers can download)"""
    
    # Different query for customers vs owners
    if current_user.role == 'customer':
        shipping = db.query(ShippingDetail).filter(
            ShippingDetail.id == shipping_detail_id,
            ShippingDetail.customer_id == current_user.customer_id,
            ShippingDetail.company_id == current_user.company_id
        ).first()
    else:
        shipping = db.query(ShippingDetail).filter(
            ShippingDetail.id == shipping_detail_id,
            ShippingDetail.company_id == current_user.company_id
        ).first()
    
    if not shipping:
        raise HTTPException(status_code=404, detail="Shipping details not found")
    
    # Check visibility for customers
    if current_user.role == 'customer':
        if not shipping.is_visible_to_customer:
            raise HTTPException(status_code=403, detail="Shipping details not visible")
    
    if not shipping.excel_file_url or not os.path.exists(shipping.excel_file_url):
        raise HTTPException(status_code=404, detail="Excel file not found")
    
    return FileResponse(
        shipping.excel_file_url,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename=f"shipping_details_{shipping_detail_id}.xlsx"
    )

@router.get("/shipping-details/{shipping_detail_id}/pdf")
async def download_shipping_pdf(
    shipping_detail_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download shipping details PDF (if available)"""
    
    # Different query for customers vs owners
    if current_user.role == 'customer':
        shipping = db.query(ShippingDetail).filter(
            ShippingDetail.id == shipping_detail_id,
            ShippingDetail.customer_id == current_user.customer_id,
            ShippingDetail.company_id == current_user.company_id
        ).first()
    else:
        shipping = db.query(ShippingDetail).filter(
            ShippingDetail.id == shipping_detail_id,
            ShippingDetail.company_id == current_user.company_id
        ).first()
    
    if not shipping:
        raise HTTPException(status_code=404, detail="Shipping details not found")
    
    # Check visibility for customers
    if current_user.role == 'customer':
        if not shipping.is_visible_to_customer:
            raise HTTPException(status_code=403, detail="Shipping details not visible")
    
    if not shipping.pdf_file_url or not os.path.exists(shipping.pdf_file_url):
        raise HTTPException(status_code=404, detail="PDF file not found")
    
    return FileResponse(
        shipping.pdf_file_url,
        media_type='application/pdf',
        filename=f"shipping_details_{shipping_detail_id}.pdf"
    )