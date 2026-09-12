import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.database import engine, Base
from app.routers import auth, candidate, recruiter, jobs, applications, resumes, ai_matching, ai_recommendations, ai_interview, admin

logger = logging.getLogger("hireai.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler to initialize database schema on startup."""
    logger.info("Initializing HireAI Database schema...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema ready.")
    yield
    logger.info("Shutting down HireAI API server.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="FastAPI Backend for HireAI - Intelligent Recruitment & Resume Screening System",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom validation exception handler for role and schema errors."""
    errors = exc.errors()
    for error in errors:
        loc = [str(item) for item in error.get("loc", [])]
        if "role" in loc:
            return JSONResponse(
                status_code=400,
                content={"detail": "Invalid user role"}
            )
    return JSONResponse(
        status_code=422,
        content={"detail": errors[0].get("msg", "Input validation failed"), "errors": errors}
    )

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register REST Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(candidate.router, prefix=settings.API_PREFIX)
app.include_router(recruiter.router, prefix=settings.API_PREFIX)
app.include_router(jobs.router, prefix=settings.API_PREFIX)
app.include_router(applications.router, prefix=settings.API_PREFIX)
app.include_router(resumes.router, prefix=settings.API_PREFIX)
app.include_router(ai_matching.router, prefix=settings.API_PREFIX)
app.include_router(ai_recommendations.router, prefix=settings.API_PREFIX)
app.include_router(ai_interview.router, prefix=settings.API_PREFIX)
app.include_router(admin.router, prefix=settings.API_PREFIX)


# Mount static uploads
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

@app.get("/")
def root_endpoint():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "message": "HireAI Backend is Running"
    }
