from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.dependencies import get_db, get_current_user, require_role
from app.models.warehouse import Warehouse
from app.models.user import User
from app.schemas.warehouse import WarehouseCreate, WarehouseUpdate, WarehouseOut

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])

@router.get("/", response_model=List[WarehouseOut])
def get_warehouses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """Get warehouses - accessible by owners and employees"""
    if current_user.role not in ['owner', 'employee']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    warehouses = db.query(Warehouse).filter(
        Warehouse.company_id == current_user.company_id
    ).offset(skip).limit(limit).all()
    return warehouses

@router.post("/", response_model=WarehouseOut, status_code=status.HTTP_201_CREATED)
def create_warehouse(
    warehouse: WarehouseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Create warehouse - owner only"""
    warehouse_data = warehouse.dict()
    warehouse_data["company_id"] = current_user.company_id
    
    # Check if warehouse with same name exists
    existing = db.query(Warehouse).filter(
        Warehouse.name == warehouse.name,
        Warehouse.company_id == current_user.company_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Warehouse with this name already exists")
    
    db_warehouse = Warehouse(**warehouse_data)
    db.add(db_warehouse)
    db.commit()
    db.refresh(db_warehouse)
    return db_warehouse

@router.get("/{warehouse_id}", response_model=WarehouseOut)
def get_warehouse(
    warehouse_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get single warehouse - accessible by owners and employees"""
    if current_user.role not in ['owner', 'employee']:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id,
        Warehouse.company_id == current_user.company_id
    ).first()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return warehouse

@router.put("/{warehouse_id}", response_model=WarehouseOut)
def update_warehouse(
    warehouse_id: UUID,
    warehouse_update: WarehouseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Update warehouse - owner only"""
    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id,
        Warehouse.company_id == current_user.company_id
    ).first()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    
    for key, value in warehouse_update.dict(exclude_unset=True).items():
        setattr(warehouse, key, value)
    
    db.commit()
    db.refresh(warehouse)
    return warehouse

@router.delete("/{warehouse_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_warehouse(
    warehouse_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("owner"))
):
    """Delete warehouse - owner only"""
    warehouse = db.query(Warehouse).filter(
        Warehouse.id == warehouse_id,
        Warehouse.company_id == current_user.company_id
    ).first()
    
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    
    db.delete(warehouse)
    db.commit()
    return None