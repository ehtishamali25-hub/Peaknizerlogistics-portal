from datetime import datetime, date
from decimal import Decimal
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.excel_batch import ExcelBatch
from app.models.excel_batch_row import ExcelBatchRow
from app.models.customer import Customer
from app.models.shipping_detail import ShippingDetail
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceCreate
from app.schemas.shipping_detail import ShippingDetailCreate

class InvoiceService:
    
    @staticmethod
    def generate_invoice_number(company_id: UUID, invoice_type: str, db: Session) -> str:
        """Generate unique invoice number"""
        today = datetime.now().strftime('%Y%m%d')
        prefix = 'SHIP' if invoice_type == 'shipping' else 'PREP'
        
        # Count existing invoices today
        count = db.query(Invoice).filter(
            Invoice.company_id == company_id,
            Invoice.created_at >= datetime.now().date()
        ).count()
        
        return f"{prefix}-{today}-{count + 1:04d}"
    
    @staticmethod
    def approve_batch(
        batch_id: UUID,
        issue_date: date,
        due_date: date,
        approved_by: UUID,
        db: Session
    ) -> dict:
        """Approve batch and generate shipping details + invoices"""
        
        # Get batch with rows
        batch = db.query(ExcelBatch).filter(
            ExcelBatch.id == batch_id
        ).first()
        
        if not batch:
            raise ValueError("Batch not found")
        
        if batch.status != 'pending':
            raise ValueError(f"Batch already {batch.status}")
        
        # Get rows
        rows = db.query(ExcelBatchRow).filter(
            ExcelBatchRow.batch_id == batch_id
        ).all()
        
        if not rows:
            raise ValueError("Batch has no rows")
        
        # Calculate totals
        row_count = len(rows)
        shipping_total = sum(row.label_cost for row in rows)
        
        # Get customer prep rate
        customer = db.query(Customer).filter(
            Customer.id == batch.customer_id
        ).first()
        prep_rate = customer.prep_rate if customer else Decimal('5.5')
        prep_total = row_count * prep_rate
        
        # Create shipping details
        shipping_detail_data = ShippingDetailCreate(
            customer_id=batch.customer_id,
            batch_id=batch.id,
            issue_date=issue_date,
            created_by=approved_by,
            company_id=batch.company_id,
            is_visible_to_customer=False
        )
        
        shipping_detail = ShippingDetail(**shipping_detail_data.dict())
        db.add(shipping_detail)
        db.flush()
        
        # Create shipping invoice
        shipping_invoice_number = InvoiceService.generate_invoice_number(
            batch.company_id, 'shipping', db
        )
        
        shipping_invoice_data = InvoiceCreate(
            company_id=batch.company_id,
            invoice_number=shipping_invoice_number,
            customer_id=batch.customer_id,
            shipping_details_id=shipping_detail.id,
            invoice_type='shipping',
            quantity=row_count,
            rate=None,
            total_amount=shipping_total,
            issue_date=issue_date,
            due_date=due_date,
            status='unpaid',
            is_visible_to_customer=False,
            created_by=approved_by
        )
        
        shipping_invoice = Invoice(**shipping_invoice_data.dict())
        db.add(shipping_invoice)
        
        # Create prep invoice
        prep_invoice_number = InvoiceService.generate_invoice_number(
            batch.company_id, 'prep', db
        )
        
        prep_invoice_data = InvoiceCreate(
            company_id=batch.company_id,
            invoice_number=prep_invoice_number,
            customer_id=batch.customer_id,
            shipping_details_id=shipping_detail.id,
            invoice_type='prep',
            quantity=row_count,
            rate=prep_rate,
            total_amount=prep_total,
            issue_date=issue_date,
            due_date=due_date,
            status='unpaid',
            is_visible_to_customer=False,
            created_by=approved_by
        )
        
        prep_invoice = Invoice(**prep_invoice_data.dict())
        db.add(prep_invoice)
        
        # Update batch status
        batch.status = 'approved'
        batch.approved_at = datetime.now()
        batch.approved_by = approved_by
        
        db.commit()
        
        return {
            'batch_id': batch.id,
            'shipping_detail_id': shipping_detail.id,
            'shipping_invoice_id': shipping_invoice.id,
            'prep_invoice_id': prep_invoice.id,
            'row_count': row_count,
            'shipping_total': shipping_total,
            'prep_total': prep_total
        }
