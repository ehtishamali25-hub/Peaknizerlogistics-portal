from sqlalchemy.orm import Session

from app.models.employee_customer import EmployeeCustomer
from app.models.user import User


def get_assigned_customer_ids(db: Session, user: User):
    """Customer ids an employee is assigned to. Returns None for owners,
    meaning 'no restriction'."""
    if user.role != 'employee':
        return None
    rows = db.query(EmployeeCustomer.customer_id).filter(
        EmployeeCustomer.employee_id == user.id
    ).all()
    return [r[0] for r in rows]