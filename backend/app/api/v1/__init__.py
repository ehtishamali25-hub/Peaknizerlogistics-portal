from fastapi import APIRouter
from app.api.v1 import registrations
from app.api.v1 import auth, customers, warehouses, products, batches, downloads, customer, invoices, shipping, payment_proofs, users, inventory, contact

router = APIRouter(prefix="/api/v1")
router.include_router(auth.router)
router.include_router(customers.router)
router.include_router(warehouses.router)
router.include_router(products.router)
router.include_router(batches.router)
router.include_router(downloads.router)
router.include_router(customer.router)
router.include_router(invoices.router)
router.include_router(shipping.router)
router.include_router(payment_proofs.router)
router.include_router(users.router)
router.include_router(inventory.router)
router.include_router(registrations.router)
router.include_router(contact.router)