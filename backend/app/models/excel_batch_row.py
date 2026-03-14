from sqlalchemy import Column, String, DECIMAL, TIMESTAMP, ForeignKey, Integer, Date, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

class ExcelBatchRow(Base):
    __tablename__ = "excel_batch_rows"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("excel_batches.id", ondelete="CASCADE"), nullable=False)
    tracking_number = Column(String(255), nullable=False)
    label_cost = Column(DECIMAL(10,2), nullable=False)
    end_customer_name = Column(String(255), nullable=False)
    order_number = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    date = Column(Date, nullable=False)
    is_valid = Column(Boolean, default=True)
    validation_errors = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
