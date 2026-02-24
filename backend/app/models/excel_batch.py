from sqlalchemy import Column, String, DECIMAL, TIMESTAMP, ForeignKey, Integer, Date, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.sql import func
import uuid
from app.database.base import Base
from sqlalchemy.orm import relationship

class ExcelBatch(Base):
    __tablename__ = "excel_batches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=False)
    upload_date = Column(TIMESTAMP(timezone=True), server_default=func.now())
    status = Column(String(50), nullable=False, default='pending')
    original_file_url = Column(Text)
    notes = Column(Text)
    approved_at = Column(TIMESTAMP(timezone=True))
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    # Relationship to customer
    customer_rel = relationship("Customer", back_populates="batches")

# Relationship to uploader (user)
    uploader_rel = relationship("User", back_populates="uploaded_batches", foreign_keys=[uploaded_by])

# Relationship to approver (user)
    approver_rel = relationship("User", foreign_keys=[approved_by])
