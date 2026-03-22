"""Pydantic schemas for authentication."""

from __future__ import annotations

from enum import Enum
from pydantic import BaseModel, EmailStr, Field


class RoleEnum(str, Enum):
    """User roles in the system."""
    
    CITIZEN = "CITIZEN"
    OFFICER = "OFFICER"
    ADMIN = "ADMIN"
    AUDITOR = "AUDITOR"
    DEPT_HEAD = "DEPT_HEAD"


class AuthTypeEnum(str, Enum):
    """Authentication method types."""
    
    BASIC = "BASIC"
    GOOGLE_OAUTH = "GOOGLE_OAUTH"
    JWT = "JWT"


# ============================================================================
# Request Schemas
# ============================================================================


class BasicAuthRequest(BaseModel):
    """Basic authentication credentials."""
    
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password")


class RegisterRequest(BaseModel):
    """User registration request."""
    
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password")
    name: str = Field(..., min_length=2, description="User full name")
    role: RoleEnum | None = Field(default=RoleEnum.CITIZEN, description="Optional user role")




class GoogleOAuthRequest(BaseModel):
    """Google OAuth token exchange request."""
    
    id_token: str = Field(..., description="Google ID token from frontend")
    access_token: str | None = Field(None, description="Optional Google access token")


class RefreshTokenRequest(BaseModel):
    """Request to refresh an access token."""
    
    refresh_token: str = Field(..., description="Valid refresh token")


class PasswordChangeRequest(BaseModel):
    """Request to change password."""
    
    current_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)


# ============================================================================
# Response Schemas
# ============================================================================


class UserResponse(BaseModel):
    """User information in responses."""
    
    id: str
    email: EmailStr
    name: str
    role: RoleEnum
    department_id: str | None = None
    is_active: bool
    created_at: str


class TokenResponse(BaseModel):
    """JWT token response."""
    
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Seconds until access token expires")
    user: UserResponse


class AuthResponse(BaseModel):
    """Generic authentication response."""
    
    success: bool
    message: str
    data: dict | None = None


# ============================================================================
# JWT Payload Schemas
# ============================================================================


class JWTPayload(BaseModel):
    """JWT token payload structure."""
    
    sub: str = Field(..., description="User ID")
    email: EmailStr
    name: str
    role: RoleEnum
    department_id: str | None = None
    auth_type: AuthTypeEnum
    exp: int = Field(..., description="Expiration timestamp")
    iat: int = Field(..., description="Issued at timestamp")
    type: str = Field(default="access", description="Token type: access or refresh")
