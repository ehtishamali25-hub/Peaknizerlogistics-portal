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
from app.services.pdf_service import PDFService

class InvoiceService:
    
    pdf_service = PDFService()
    
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
        """Approve batch and generate shipping details + invoices with PDFs"""
        
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
        total_quantity = sum(row.quantity for row in rows)  # NEW: Sum of all quantities
        shipping_total = sum(row.label_cost for row in rows)
        
        # Get customer prep rate
        customer = db.query(Customer).filter(
            Customer.id == batch.customer_id
        ).first()
        prep_rate = customer.prep_rate if customer else Decimal('5.5')
        
        # NEW: Calculate prep invoice values with discount
        base_prep_total = row_count * prep_rate  # Amount based on tracking count (original amount)
        total_prep_value = total_quantity * prep_rate  # Total amount based on sum of quantities
        
        # Calculate discount percentage
        if total_prep_value > 0:
            discount_percentage = ((total_prep_value - base_prep_total) * 100) / total_prep_value
        else:
            discount_percentage = Decimal('0')
        
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
        
        # Create prep invoice with discount
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
            total_amount=base_prep_total,  # Keep original amount for payment
            issue_date=issue_date,
            due_date=due_date,
            status='unpaid',
            is_visible_to_customer=False,
            created_by=approved_by,
            # NEW: Add discount fields - we'll need to extend the schema
            total_quantity=total_quantity,
            total_prep_value=float(total_prep_value),
            discount_percentage=float(discount_percentage)
        )
        
        prep_invoice = Invoice(**prep_invoice_data.dict())
        db.add(prep_invoice)
        
        db.flush()
        
        # Prepare data for PDF generation
        rows_data = [{
            'tracking_number': r.tracking_number,
            'label_cost': float(r.label_cost),
            'end_customer_name': r.end_customer_name,
            'order_number': r.order_number,
            'quantity': r.quantity,
            'date': r.date.strftime('%Y-%m-%d')
        } for r in rows]
        
        # Generate shipping invoice PDF
        shipping_invoice_pdf_data = {
            'invoice_number': shipping_invoice_number,
            'invoice_type': 'shipping',
            'customer_name': customer.customer_name,
            'customer_code': customer.customer_code,
            'issue_date': issue_date.strftime('%Y-%m-%d'),
            'due_date': due_date.strftime('%Y-%m-%d'),
            'status': 'unpaid',
            'total_amount': float(shipping_total),
            'quantity': row_count,
            'rate': None
        }
        
        shipping_pdf_path = InvoiceService.pdf_service.generate_invoice_pdf(
            shipping_invoice_pdf_data, rows_data
        )
        shipping_invoice.pdf_url = shipping_pdf_path
        
        # Generate prep invoice PDF with discount
        prep_invoice_pdf_data = {
            'invoice_number': prep_invoice_number,
            'invoice_type': 'prep',
            'customer_name': customer.customer_name,
            'customer_code': customer.customer_code,
            'issue_date': issue_date.strftime('%Y-%m-%d'),
            'due_date': due_date.strftime('%Y-%m-%d'),
            'status': 'unpaid',
            'total_amount': float(base_prep_total),
            'quantity': row_count,
            'rate': float(prep_rate),
            'total_quantity': total_quantity,  # NEW
            'total_prep_value': float(total_prep_value),  # NEW
            'discount_percentage': float(discount_percentage)  # NEW
        }
        
        prep_pdf_path = InvoiceService.pdf_service.generate_invoice_pdf(prep_invoice_pdf_data)
        prep_invoice.pdf_url = prep_pdf_path
        
        # Generate shipping details Excel
        shipping_detail_data = {
            'batch_id': str(batch.id)
        }
        excel_path = InvoiceService.pdf_service.generate_shipping_details_excel(
            shipping_detail_data, rows_data
        )
        shipping_detail.excel_file_url = excel_path
        
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
            'total_quantity': total_quantity,  # NEW
            'shipping_total': float(shipping_total),
            'prep_total': float(base_prep_total),
            'total_prep_value': float(total_prep_value),  # NEW
            'discount_percentage': float(discount_percentage),  # NEW
            'shipping_pdf': shipping_pdf_path,
            'prep_pdf': prep_pdf_path,
            'excel_file': excel_path
        }