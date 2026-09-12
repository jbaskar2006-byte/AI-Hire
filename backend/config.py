import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Required Environment Variables
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+pymysql://root:Root%40123@localhost:3306/hireai_db"
    )
    JWT_SECRET: str = os.getenv(
        "JWT_SECRET", 
        "hireai_super_secret_jwt_key_2026_engineering_project_secure"
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

    # System Constants
    APP_NAME: str = "HireAI - Intelligent AI Recruitment System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
