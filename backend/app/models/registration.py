from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

class RegistrationRequest(Base):
    __tablename__ = "registration_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(50), nullable=False)
    company_name = Column(String(255))
    company_address = Column(Text)
    password_hash = Column(String(255), nullable=False)
    notes = Column(Text)
    status = Column(String(50), default='pending')  # pending, approved, declined
    rejection_reason = Column(Text)  # Add this for decline reason
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    reviewed_at = Column(TIMESTAMP(timezone=True))
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))