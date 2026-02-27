from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import router as api_router
from app.database.base import Base
from app.database.session import engine
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created/verified!")
    yield
    # Shutdown: Clean up (if needed)
    print("👋 Shutting down...")

app = FastAPI(
    title="Peaknizer 3PL API",
    description="Backend for 3PL warehouse portal",
    version="0.1.0",
    lifespan=lifespan 
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://peaknizer-frontend.onrender.com", "https://www.peaknizerlogistics.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Peaknizer 3PL API is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Peaknizer-3PL", "database": "connected"}
