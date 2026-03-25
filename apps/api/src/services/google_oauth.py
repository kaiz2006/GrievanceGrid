"""Firebase ID token verification without firebase-admin network dependency."""

from __future__ import annotations

import logging
import time
from typing import Any

import httpx
from jose import jwt, JWTError

from src.core.config import settings

logger = logging.getLogger(__name__)

# Google's public keys for Firebase tokens
_FIREBASE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
_cert_cache: dict = {}
_cert_cache_expiry: float = 0.0


async def _get_firebase_public_keys() -> dict[str, str]:
    """Fetch and cache Firebase public certificates."""
    global _cert_cache, _cert_cache_expiry

    now = time.time()
    if _cert_cache and now < _cert_cache_expiry:
        return _cert_cache

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(_FIREBASE_CERTS_URL)
        resp.raise_for_status()
        _cert_cache = resp.json()
        # Cache-Control header tells us how long to cache
        cc = resp.headers.get("cache-control", "")
        max_age = 3600
        for part in cc.split(","):
            part = part.strip()
            if part.startswith("max-age="):
                try:
                    max_age = int(part.split("=")[1])
                except ValueError:
                    pass
        _cert_cache_expiry = now + max_age

    return _cert_cache


class GoogleOAuthService:
    """Verify Firebase ID tokens issued by Firebase Authentication."""

    @staticmethod
    async def verify_id_token(id_token_str: str) -> dict[str, Any] | None:
        """
        Verify a Firebase ID token and return the user's profile.

        Args:
            id_token_str: Firebase ID token from result.user.getIdToken()

        Returns:
            User info dict or None if invalid.
        """
        if not settings.firebase_project_id:
            logger.error("FIREBASE_PROJECT_ID not configured")
            return None

        try:
            certs = await _get_firebase_public_keys()
        except Exception as e:
            logger.error("Failed to fetch Firebase public keys: %s", e)
            return None

        # Try each certificate until one verifies
        decoded = None
        last_error = None
        for kid, cert_pem in certs.items():
            try:
                decoded = jwt.decode(
                    id_token_str,
                    cert_pem,
                    algorithms=["RS256"],
                    audience=settings.firebase_project_id,
                    issuer=f"https://securetoken.google.com/{settings.firebase_project_id}",
                    options={"leeway": 10},
                )
                break
            except JWTError as e:
                last_error = e
                continue

        if decoded is None:
            logger.warning("Firebase token verification failed: %s", last_error)
            return None

        if not decoded.get("email_verified"):
            logger.warning("Firebase token email not verified for uid=%s", decoded.get("sub"))
            return None

        return {
            "sub": decoded.get("sub"),
            "email": decoded.get("email"),
            "name": decoded.get("name") or decoded.get("email"),
            "picture": decoded.get("picture"),
            "auth_type": "GOOGLE_OAUTH",
        }
