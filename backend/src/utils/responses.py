"""
Response Utilities
"""
from typing import Any, Dict, Optional
from fastapi.responses import JSONResponse
from fastapi import status

def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = status.HTTP_200_OK
) -> Dict[str, Any]:
    """Create a success response"""
    return {
        "success": True,
        "data": data,
        "message": message
    }

def error_response(
    error: str,
    error_code: Optional[str] = None,
    status_code: int = status.HTTP_400_BAD_REQUEST
) -> Dict[str, Any]:
    """Create an error response"""
    response = {
        "success": False,
        "error": error
    }
    if error_code:
        response["errorCode"] = error_code
    return response