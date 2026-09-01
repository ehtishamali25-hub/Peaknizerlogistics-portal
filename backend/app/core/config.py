
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/peaknizer_db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

     # Charity settings — only invoices issued on/after this date count toward the charity total
    CHARITY_START_DATE: str = os.getenv("CHARITY_START_DATE", "2026-09-01")
    CHARITY_RATE_PER_ORDER: float = float(os.getenv("CHARITY_RATE_PER_ORDER", "0.20"))
    
    # Email settings
    SMTP_HOST: str = os.getenv("SMTP_HOST", "mail.peaknizerlogistics.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "465"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "Peaknizer Logistics <info@peaknizerlogistics.com>")
    SMTP_USE_SSL: bool = os.getenv("SMTP_USE_SSL", "True") == "True"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
