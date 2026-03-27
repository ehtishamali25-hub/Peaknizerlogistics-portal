from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/peaknizer_db")

# Fix for Render's postgres:// vs postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configure connection pool
engine = create_engine(
    DATABASE_URL,
    pool_size=10,           # Increase from default 5
    max_overflow=20,        # Increase from default 10
    pool_pre_ping=True,     # Check connections before using
    pool_recycle=3600       # Recycle connections after 1 hour
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  # This is critical – always close


from sqlalchemy import event

@event.listens_for(engine, "checkout")
def receive_checkout(dbapi_connection, connection_record, connection_proxy):
    """Debug: Log when connections are checked out"""
    print(f"Connection checked out. Pool size: {engine.pool.size()}, overflow: {engine.pool.overflow()}")

@event.listens_for(engine, "checkin")
def receive_checkin(dbapi_connection, connection_record):
    """Debug: Log when connections are returned"""
    print("Connection checked in")        