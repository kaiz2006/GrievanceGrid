"""Google OAuth 2.0 authentication service."""

from __future__ import annotations

import os
import httpx
from datetime import datetime
from typing import Any, Optional

from google.auth.transport import requests
from google.oauth2 import id_token


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback")


class GoogleOAuthService:
    """Service for Google OAuth authentication flow."""
    
    @staticmethod
    async def verify_id_token(id_token_str: str) -> dict[str, Any] | None:
        """
        Verify Google ID token and extract user information.
        
        Args:
            id_token_str: Google ID token from frontend
            
        Returns:
            User info dict with fields: sub, email, name, picture, or None if invalid
        """
        try:
            # Verify the token signature
            idinfo = id_token.verify_oauth2_token(
                id_token_str,
                requests.Request(),
                GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=10,
            )
            
            # Token is valid, extract user info
            if idinfo.get("email_verified"):
                return {
                    "sub": idinfo.get("sub"),
                    "email": idinfo.get("email"),
                    "name": idinfo.get("name"),
                    "picture": idinfo.get("picture"),
                    "auth_type": "GOOGLE_OAUTH",
                }
        except Exception as e:
            print(f"Failed to verify Google ID token: {e}")
            return None
        
        return None
    
    @staticmethod
    async def exchange_code_for_token(code: str) -> dict[str, Any] | None:
        """
        Exchange authorization code for access and ID tokens.
        
        Args:
            code: Authorization code from Google OAuth flow
            
        Returns:
            Token response with access_token and id_token, or None on failure
        """
        if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
            return None
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "client_id": GOOGLE_CLIENT_ID,
                        "client_secret": GOOGLE_CLIENT_SECRET,
                        "code": code,
                        "grant_type": "authorization_code",
                        "redirect_uri": GOOGLE_REDIRECT_URI,
                    },
                )
                
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                print(f"Failed to exchange OAuth code: {e}")
        
        return None
    
    @staticmethod
    async def refresh_access_token(refresh_token: str) -> dict[str, Any] | None:
        """
        Refresh Google access token using refresh token.
        
        Args:
            refresh_token: Google refresh token
            
        Returns:
            New token response or None on failure
        """
        if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
            return None
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "client_id": GOOGLE_CLIENT_ID,
                        "client_secret": GOOGLE_CLIENT_SECRET,
                        "refresh_token": refresh_token,
                        "grant_type": "refresh_token",
                    },
                )
                
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                print(f"Failed to refresh Google access token: {e}")
        
        return None
    
    @staticmethod
    def get_authorization_url(state: str | None = None, scope: str | None = None) -> str:
        """
        Generate Google OAuth authorization URL.
        
        Args:
            state: CSRF protection state parameter
            scope: OAuth scopes to request
            
        Returns:
            Authorization URL for frontend redirect
        """
        if not GOOGLE_CLIENT_ID:
            return ""
        
        default_scope = "openid email profile"
        if scope:
            default_scope = scope
        
        params = {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": default_scope,
            "access_type": "offline",
        }
        
        if state:
            params["state"] = state
        
        param_str = "&".join(f"{k}={v}" for k, v in params.items())
        return f"https://accounts.google.com/o/oauth2/v2/auth?{param_str}"
