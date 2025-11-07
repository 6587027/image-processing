from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "ZenithComp Image Processing"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    UPLOAD_DIR: str = "uploads"
    TEMP_DIR: str = "temp"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024
    ALLOWED_EXTENSIONS: set = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}
    
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()