from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import os
import shutil
from datetime import datetime

from app.core.dependencies import get_db, require_role, get_current_user
from app.models.user import User
from app.models.excel_batch import ExcelBatch
from app.models.excel_batch_row import ExcelBatchRow
from app.models.customer import Customer
from app.schemas.excel_batch import ExcelBatchCreate, ExcelBatchOut, ExcelBatchRowOut, BatchApproveRequest
from app.services.excel_service import ExcelService
from app.services.invoice_service import InvoiceService

router = APIRouter(prefix="/batches", tags=["Batches"])

UPLOAD_DIR = "/opt/render/project/src/backend/uploads/excel"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ExcelBatchOut, status_code=status.HTTP_201_CREATED)
async def upload_excel_batch(
    file: UploadFile = File(...),
    customer_id: UUID = Form(...),
    notes: str = Form(""),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("employee"))
):
    # Verify customer exists and belongs to company
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.company_id == current_user.company_id
    ).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Validate file type
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only Excel files are allowed")
    
    # Save file
    filename = ExcelService.generate_filename(customer.customer_code)
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Validate and parse Excel
    is_valid, rows, errors = ExcelService.validate_excel_file(file_path)
    
    if errors:
        raise HTTPException(status_code=400, detail=f"Excel validation failed: {errors}")
    
    # Create batch record
    batch_data = {
        "company_id": current_user.company_id,
        "customer_id": customer_id,
        "uploaded_by": current_user.id,
        "status": "pending",
        "original_file_url": file_path,
        "notes": notes
    }
    
    db_batch = ExcelBatch(**batch_data)
    db.add(db_batch)
    db.flush()
    
    # Create row records
    for row in rows:
        row_data = {
            "company_id": current_user.company_id,
            "batch_id": db_batch.id,
            "tracking_number": row['tracking_number'],
            "label_cost": row['label_cost'],
            "end_customer_name": row['end_customer_name'],
            "order_number": row['order_number'],
            "quantity": row['quantity'],
            "date": row['date'],
            "is_valid": row['is_valid'],
            "validation_errors": row['validation_errors']
        }
        db_row = ExcelBatchRow(**row_data)
        db.add(db_row)
    
    db.commit()
    db.refresh(db_batch)
    
    return db_batch

@router.get("/", response_model=List[ExcelBatchOut])
def get_batches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    customer_id: Optional[UUID] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get batches - accessible by owners and employees"""
    # Allow both owners and employees to view batches
    if current_user.role not in ['owner', 'employee']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Query with joins to get related data
    query = db.query(ExcelBatch).filter(
        ExcelBatch.company_id == current_user.company_id
    )
    
    if customer_id:
        query = query.filter(ExcelBatch.customer_id == customer_id)
    if status:
        query = query.filter(ExcelBatch.status == status)
    
    batches = query.order_by(ExcelBatch.upload_date.desc()).offset(skip).limit(limit).all()
    
    # Now manually add the related data to each batch object
    # We'll add temporary attributes that we can use in the response
    for batch in batches:
        # Add customer_code as a temporary attribute
        if batch.customer_rel:
            batch.customer_code = batch.customer_rel.customer_code
        else:
            batch.customer_code = None
            
        # Add uploader_name as a temporary attribute
        if batch.uploader_rel:
            batch.uploader_name = batch.uploader_rel.full_name
        else:
            batch.uploader_name = None
    
    return batches

@router.get("/{batch_id}", response_model=ExcelBatchOut)
def get_batch(
    batch_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Changed from require_role("owner")
):
    """Get single batch - accessible by owners and employees"""
    if current_user.role not in ['owner', 'employee']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    batch = db.query(ExcelBatch).filter(
        ExcelBatch.id == batch_id,
        ExcelBatch.company_id == current_user.company_id
    ).first()
    
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    # Load rows
    batch.rows = db.query(ExcelBatchRow).filter(
        ExcelBatchRow.batch_id == batch_id
    ).all()
    

    return batch

@router.put("/{batch_id}/rows", response_model=List[ExcelBatchRowOut])
def update_batch_rows(
    batch_id: UUID,
    rows: List[dict],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    # Verify batch exists and belongs to company
    batch = db.query(ExcelBatch).filter(
        ExcelBatch.id == batch_id,
        ExcelBatch.company_id == current_user.company_id
    ).first()
    
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    if batch.status != "pending":
        raise HTTPException(status_code=400, detail="Cannot edit approved or rejected batch")
    
    updated_rows = []
    
    for row_data in rows:
        row_id = row_data.get('id')
        if row_id:
            # Update existing row
            row = db.query(ExcelBatchRow).filter(
                ExcelBatchRow.id == row_id,
                ExcelBatchRow.batch_id == batch_id
            ).first()
            
            if row:
                for key, value in row_data.items():
                    if key != 'id' and hasattr(row, key):
                        setattr(row, key, value)
                updated_rows.append(row)
    
    db.commit()
    
    # Return all rows
    all_rows = db.query(ExcelBatchRow).filter(
        ExcelBatchRow.batch_id == batch_id
    ).all()
    
    return all_rows

@router.post("/{batch_id}/approve", status_code=status.HTTP_200_OK)
def approve_batch(
    batch_id: UUID,
    approve_data: BatchApproveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    try:
        result = InvoiceService.approve_batch(
            batch_id=batch_id,
            issue_date=approve_data.issue_date,
            due_date=approve_data.due_date,
            approved_by=current_user.id,
            db=db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/test-permissions", response_model=dict)
def test_permissions(
    current_user: User = Depends(get_current_user)
):
    """Test endpoint to check current user permissions"""
    return {
        "user_id": str(current_user.id),
        "user_role": current_user.role,
        "company_id": str(current_user.company_id),
        "has_access": current_user.role in ['owner', 'employee']
    }