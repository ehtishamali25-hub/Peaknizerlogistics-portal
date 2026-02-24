from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.dependencies import get_db, require_role, get_current_user
from app.models.shipping_detail import ShippingDetail
from app.models.user import User
from app.schemas.shipping_detail import ShippingDetailOut
from app.services.pdf_service import PDFService
from app.models.excel_batch_row import ExcelBatchRow

router = APIRouter(prefix="/shipping-details", tags=["Shipping Details"])

@router.get("/", response_model=List[ShippingDetailOut])
def get_all_shipping_details(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner")),
    skip: int = 0,
    limit: int = 100
):
    """Get all shipping details - owner only"""
    
    shipping_details = db.query(ShippingDetail).filter(
        ShippingDetail.company_id == current_user.company_id
    ).order_by(ShippingDetail.created_at.desc()).offset(skip).limit(limit).all()
    
    return shipping_details

@router.get("/{shipping_detail_id}", response_model=ShippingDetailOut)
def get_shipping_detail(
    shipping_detail_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Get single shipping detail - owner only"""
    
    shipping = db.query(ShippingDetail).filter(
        ShippingDetail.id == shipping_detail_id,
        ShippingDetail.company_id == current_user.company_id
    ).first()
    
    if not shipping:
        raise HTTPException(status_code=404, detail="Shipping details not found")
    
    return shipping

@router.put("/{shipping_detail_id}/visibility", status_code=status.HTTP_200_OK)
def toggle_shipping_visibility(
    shipping_detail_id: UUID,
    visible: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Toggle shipping details visibility for customer"""
    
    shipping = db.query(ShippingDetail).filter(
        ShippingDetail.id == shipping_detail_id,
        ShippingDetail.company_id == current_user.company_id
    ).first()
    
    if not shipping:
        raise HTTPException(status_code=404, detail="Shipping details not found")
    
    shipping.is_visible_to_customer = visible
    db.commit()
    
    return {"message": f"Shipping details visibility set to {visible}", "shipping_detail_id": str(shipping_detail_id)}



@router.post("/{shipping_detail_id}/regenerate-excel", response_model=dict)
def regenerate_shipping_excel(
    shipping_detail_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Regenerate Excel file for shipping details"""
    
    shipping = db.query(ShippingDetail).filter(
        ShippingDetail.id == shipping_detail_id,
        ShippingDetail.company_id == current_user.company_id
    ).first()
    
    if not shipping:
        raise HTTPException(status_code=404, detail="Shipping details not found")
    
    # Get batch rows
    batch_rows = db.query(ExcelBatchRow).filter(
        ExcelBatchRow.batch_id == shipping.batch_id
    ).all()
    
    if not batch_rows:
        raise HTTPException(status_code=404, detail="No batch rows found")
    
    # Prepare rows data
    rows_data = [{
        'tracking_number': r.tracking_number,
        'label_cost': float(r.label_cost),
        'end_customer_name': r.end_customer_name,
        'order_number': r.order_number,
        'date': r.date.strftime('%Y-%m-%d')
    } for r in batch_rows]
    
    # Generate Excel
    pdf_service = PDFService()
    excel_path = pdf_service.generate_shipping_details_excel(
        {'batch_id': str(shipping.batch_id)},
        rows_data
    )
    
    # Update shipping detail with Excel path
    shipping.excel_file_url = excel_path
    db.commit()
    
    return {
        "message": "Excel file regenerated successfully",
        "shipping_detail_id": str(shipping_detail_id),
        "excel_url": excel_path
    }