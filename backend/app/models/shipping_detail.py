from sqlalchemy import Column, String, Boolean, TIMESTAMP, ForeignKey, Date, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

class ShippingDetail(Base):
    __tablename__ = "shipping_details"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("excel_batches.id", ondelete="CASCADE"), nullable=False, unique=True)
    issue_date = Column(Date, nullable=False)
    excel_file_url = Column(Text)
    pdf_file_url = Column(Text)
    is_visible_to_customer = Column(Boolean, default=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
