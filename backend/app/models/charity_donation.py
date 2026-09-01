from sqlalchemy import Column, String, Date, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

class CharityDonation(Base):
    __tablename__ = "charity_donations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    donor_name = Column(String(255), nullable=False)
    contact = Column(String(255))
    purpose = Column(String(255))
    amount = Column(DECIMAL(10, 2), nullable=False)
    donated_on = Column(Date, nullable=False, server_default=func.current_date())
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())