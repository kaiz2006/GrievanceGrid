"""
Token Utilities
"""
import firebase_admin
from firebase_admin import auth, credentials
from src.config.settings import settings
from src.utils.errors import AuthenticationError
import structlog

logger = structlog.get_logger(__name__)

# Initialize Firebase Admin SDK
try:
    if settings.FIREBASE_PROJECT_ID and settings.FIREBASE_PRIVATE_KEY:
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": settings.FIREBASE_PROJECT_ID,
            "private_key": settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n'),
            "client_email": settings.FIREBASE_CLIENT_EMAIL,
        })
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized")
    else:
        logger.warning("Firebase credentials not provided, using mock mode")
except Exception as e:
    logger.error("Failed to initialize Firebase", error=str(e))

async def verify_firebase_token(token: str) -> dict:
    """
    Verify Firebase ID token

    Args:
        token: Firebase ID token

    Returns:
        Decoded token payload

    Raises:
        AuthenticationError: If token is invalid
    """
    try:
        # In production, verify with Firebase
        if firebase_admin._apps:
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        else:
            # Mock mode for development
            logger.warning("Using mock Firebase token verification")
            return {
                "uid": "mock_uid",
                "email": "mock@example.com",
                "name": "Mock User"
            }
    except Exception as e:
        logger.error("Firebase token verification failed", error=str(e))
        raise AuthenticationError("Invalid authentication token")