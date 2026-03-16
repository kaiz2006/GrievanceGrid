"""
Error Handler Middleware
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from src.utils.responses import error_response
from src.utils.errors import GrievanceGridException
import structlog

logger = structlog.get_logger(__name__)

def add_exception_handlers(app):
    """Add global exception handlers to FastAPI app"""

    @app.exception_handler(GrievanceGridException)
    async def grievance_grid_exception_handler(request: Request, exc: GrievanceGridException):
        """Handle GrievanceGrid custom exceptions"""
        logger.error(
            "GrievanceGrid exception",
            error_code=exc.error_code,
            detail=exc.detail,
            path=request.url.path,
            method=request.method
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(exc.detail, exc.error_code)
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """Handle FastAPI HTTP exceptions"""
        logger.error(
            "HTTP exception",
            status_code=exc.status_code,
            detail=exc.detail,
            path=request.url.path,
            method=request.method
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(exc.detail)
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """Handle general exceptions"""
        logger.error(
            "Unhandled exception",
            error=str(exc),
            path=request.url.path,
            method=request.method,
            exc_info=True
        )
        return JSONResponse(
            status_code=500,
            content=error_response("Internal server error", "INTERNAL_ERROR")
        )