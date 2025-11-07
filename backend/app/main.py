from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.routes import upload, similarity
import os

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Zenith Comp Image Processing API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.TEMP_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
app.mount("/temp", StaticFiles(directory=settings.TEMP_DIR), name="temp")

@app.get("/")
async def root():
    return {
        "message": "Zenith Comp Image Processing API",
        "version": settings.VERSION,
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "company": "Zenith Comp"
    }

app.include_router(upload.router, prefix=settings.API_V1_PREFIX, tags=["upload"])
app.include_router(similarity.router, prefix=settings.API_V1_PREFIX, tags=["similarity"])