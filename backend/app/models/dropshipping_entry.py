from sqlalchemy import Column, String, Text, Date, Integer, Sequence, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.database.base import Base

# Allowed values (also enforced by CHECK constraints in the database)
SHIPPING_STATUSES = ('unshipped', 'partially_shipped', 'shipped')
ARRIVAL_STATUSES = ('not_received', 'partially_received', 'fully_received')
APPROVAL_STATUSES = ('pending', 'approved')


class DropshippingEntry(Base):
    __tablename__ = "dropshipping_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)

    # Company-wide running number (shown as DS-00001); filled in by the database
    entry_number = Column(
        Integer,
        Sequence("dropshipping_entries_entry_number_seq"),
        nullable=False,
        unique=True
    )
    # Date typed by the customer. created_at is the real upload time.
    entry_date = Column(Date, nullable=False)

    excel_file_path = Column(Text, nullable=False)
    excel_original_name = Column(String(255), nullable=False)
    labels_file_path = Column(Text, nullable=False)
    labels_original_name = Column(String(255), nullable=False)

    # Set by owner / employee
    shipping_status = Column(String(30), nullable=False, default='unshipped', server_default='unshipped')
    arrival_status = Column(String(30), nullable=False, default='not_received', server_default='not_received')

    # Set by the owner when the Prep invoice is generated
    approval_status = Column(String(20), nullable=False, default='pending', server_default='pending')
    prep_invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id", ondelete="SET NULL"), nullable=True)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    approved_at = Column(TIMESTAMP(timezone=True), nullable=True)

    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    @property
    def entry_code(self):
        """Display number, e.g. DS-00001"""
        return f"DS-{self.entry_number:05d}" if self.entry_number is not None else None