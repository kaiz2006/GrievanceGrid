"""
GrievanceGrid Backend - Main FastAPI Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import structlog

from src.config.settings import settings
from src.routes import router
from src.middlewares.error_handler import add_exception_handlers
from src.middlewares.security_headers import SecurityHeadersMiddleware
from src.utils.logger import setup_logging
from src.models.base import create_tables

# Setup structured logging
setup_logging()

logger = structlog.get_logger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager"""
    logger.info("Starting GrievanceGrid Backend")

    # Create database tables
    create_tables()

    # Seed database with demo data
    from src.seed import seed_database
    seed_database()

    yield

    logger.info("Shutting down GrievanceGrid Backend")

# Create FastAPI app
app = FastAPI(
    title="GrievanceGrid API",
    description="Centralized digital grievance management platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers
app.add_middleware(SecurityHeadersMiddleware)

# Trusted hosts
if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )

# Add exception handlers
add_exception_handlers(app)

# Include routes
app.include_router(router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "GrievanceGrid Backend"}

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to GrievanceGrid API",
        "docs": "/docs",
        "version": "1.0.0"
    }