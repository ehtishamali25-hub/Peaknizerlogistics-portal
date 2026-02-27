from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import router as api_router

app = FastAPI(
    title="Peaknizer 3PL API",
    description="Backend for 3PL warehouse portal",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://peaknizer-frontend.onrender.com"],
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
