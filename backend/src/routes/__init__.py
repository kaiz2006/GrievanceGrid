"""
Routes Package
"""
from fastapi import APIRouter
from src.controllers import (
    auth_controller,
    complaint_controller,
    department_controller,
    officer_controller,
    analytics_controller,
    search_controller
)

# Create main router
router = APIRouter()

# Include sub-routers
router.include_router(auth_controller.router, prefix="/auth", tags=["Authentication"])
router.include_router(complaint_controller.router, prefix="/complaints", tags=["Complaints"])
router.include_router(department_controller.router, prefix="/departments", tags=["Departments"])
router.include_router(officer_controller.router, prefix="/officer", tags=["Officer"])
router.include_router(analytics_controller.router, prefix="/analytics", tags=["Analytics"])
router.include_router(search_controller.router, prefix="/search", tags=["Search"])
