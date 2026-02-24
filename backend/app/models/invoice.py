from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, Date, Text, DECIMAL, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    invoice_number = Column(String(100), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    shipping_details_id = Column(UUID(as_uuid=True), ForeignKey("shipping_details.id", ondelete="CASCADE"), nullable=False)
    invoice_type = Column(String(50), nullable=False)
    quantity = Column(Integer, nullable=False)
    rate = Column(DECIMAL(10,2))
    total_amount = Column(DECIMAL(10,2), nullable=False)
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(50), nullable=False, default='unpaid')
    pdf_url = Column(Text)
    is_visible_to_customer = Column(Boolean, default=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=False)
    owner_overridden = Column(Boolean, default=False)
    override_notes = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
