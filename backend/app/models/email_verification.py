from sqlalchemy import Column, String, Integer, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    customer_name = Column(String(255), nullable=False)
    otp_code = Column(String(6), nullable=False)
    otp_expires_at = Column(TIMESTAMP(timezone=True), nullable=False)
    attempts = Column(Integer, nullable=False, default=0)
    verified = Column(Boolean, nullable=False, default=False)
    verified_at = Column(TIMESTAMP(timezone=True), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())