from sqlalchemy import Column, String, Integer, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

class RegistrationDocument(Base):
    __tablename__ = "registration_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    registration_id = Column(
        UUID(as_uuid=True),
        ForeignKey("registration_requests.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    original_filename = Column(String(255), nullable=False)
    stored_path = Column(Text, nullable=False)
    content_type = Column(String(100))
    file_size = Column(Integer)
    uploaded_at = Column(TIMESTAMP(timezone=True), server_default=func.now())