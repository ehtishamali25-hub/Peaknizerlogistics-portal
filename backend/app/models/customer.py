from sqlalchemy import Column, String, Boolean, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base
from sqlalchemy.orm import relationship
from app.models.customer_warehouse import CustomerWarehouse

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_code = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    prep_rate = Column(DECIMAL(10,2), nullable=False, default=5.5)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    # Relationship to batches
    batches = relationship("ExcelBatch", back_populates="customer_rel")
   

    # Add this with other relationships
    assigned_warehouses = relationship("CustomerWarehouse", back_populates="customer", cascade="all, delete-orphan")
    