#!/usr/bin/env python3
"""
GrievanceGrid Backend - FastAPI Application Entry Point
"""
# Apply Python 3.13 compatibility patch before any other imports
import python313_patch

import uvicorn
from src.config.settings import settings

if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )