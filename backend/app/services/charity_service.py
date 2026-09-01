from decimal import Decimal
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID

from app.models.invoice import Invoice
from app.models.charity_donation import CharityDonation
from app.core.config import settings


class CharityService:

    @staticmethod
    def calculate_total_for_charity(company_id: UUID, db: Session) -> Decimal:
        """
        For each prep invoice issued on/after CHARITY_START_DATE:
            orders = invoice.total_amount / invoice.rate
        total_charity = CHARITY_RATE_PER_ORDER * SUM(orders across all such invoices)
        """
        cutoff = date.fromisoformat(settings.CHARITY_START_DATE)

        invoices = db.query(Invoice).filter(
            Invoice.company_id == company_id,
            Invoice.invoice_type == 'prep',
            Invoice.issue_date >= cutoff,
            Invoice.rate.isnot(None),
            Invoice.rate > 0
        ).all()

        total_orders = Decimal('0')
        for inv in invoices:
            total_orders += inv.total_amount / inv.rate

        charity_rate = Decimal(str(settings.CHARITY_RATE_PER_ORDER))
        return (total_orders * charity_rate).quantize(Decimal('0.01'))

    @staticmethod
    def calculate_amount_donated(company_id: UUID, db: Session) -> Decimal:
        total = db.query(func.coalesce(func.sum(CharityDonation.amount), 0)).filter(
            CharityDonation.company_id == company_id
        ).scalar()
        return Decimal(str(total)).quantize(Decimal('0.01'))

    @staticmethod
    def get_summary(company_id: UUID, db: Session) -> dict:
        total_for_charity = CharityService.calculate_total_for_charity(company_id, db)
        amount_donated = CharityService.calculate_amount_donated(company_id, db)
        balance_remaining = (total_for_charity - amount_donated).quantize(Decimal('0.01'))

        return {
            "total_amount_for_charity": total_for_charity,
            "amount_donated": amount_donated,
            "balance_remaining": balance_remaining
        }