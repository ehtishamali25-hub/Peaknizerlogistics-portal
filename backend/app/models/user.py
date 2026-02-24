from sqlalchemy import Column, String, Boolean, ForeignKey, Enum, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum('owner', 'employee', 'customer', name='user_roles'), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    # Relationship to batches they uploaded
    uploaded_batches = relationship("ExcelBatch", back_populates="uploader_rel", foreign_keys="ExcelBatch.uploaded_by")
    # Relationships for assignments
    assigned_customers = relationship("EmployeeCustomer", back_populates="employee", cascade="all, delete-orphan")
    assigned_warehouses = relationship("EmployeeWarehouse", back_populates="employee", cascade="all, delete-orphan")
