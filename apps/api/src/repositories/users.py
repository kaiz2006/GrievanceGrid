"""
Repository for User database operations
Handles authentication and user profile queries
"""
from typing import List, Optional, Dict, Any
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from src.repositories.base import BaseRepository
from src.core.auth import get_password_hash, verify_password


class UserRepository(BaseRepository):
    """
    Repository for user-related database operations
    """
    
    async def create_user(
        self,
        email: str,
        name: str,
        password: str | None = None,
        role: str = "CITIZEN",
        department_id: str | None = None,
        auth_type: str = "BASIC",
    ) -> Dict[str, Any]:
        """Create a new user account."""
        user_id = str(uuid4())
        hashed_password = get_password_hash(password) if password else None
        
        query = """
        INSERT INTO users (
            id, email, name, password_hash, role, department_id,
            auth_type, is_active, created_at, updated_at
        ) VALUES (
            :id, :email, :name, :password_hash, :role, :department_id,
            :auth_type, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        ) RETURNING id, email, name, role, department_id, is_active, created_at
        """
        result = await self.fetch_one(
            query,
            {
                "id": user_id,
                "email": email.lower(),
                "name": name,
                "password_hash": hashed_password,
                "role": role,
                "department_id": department_id,
                "auth_type": auth_type,
            },
        )
        return dict(result) if result else {}
    
    async def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        query = """
        SELECT id, email, name, role, auth_type, password_hash, phone, 
               is_active, created_at, updated_at
        FROM users WHERE email = :email AND is_active = true
        """
        return await self.fetch_one(query, {"email": email.lower()})
    
    async def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        query = """
        SELECT id, email, name, role, auth_type, phone, 
               is_active, created_at, updated_at
        FROM users WHERE id = :user_id
        """
        return await self.fetch_one(query, {"user_id": user_id})
    
    async def verify_credentials(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Verify user credentials and return user if valid."""
        user = await self.get_by_email(email)
        if not user or not user.get("password_hash"):
            return None
        
        if verify_password(password, user["password_hash"]):
            return user
        return None
    
    async def user_exists(self, email: str) -> bool:
        """Check if user exists by email."""
        result = await self.fetch_one(
            "SELECT 1 FROM users WHERE email = :email LIMIT 1",
            {"email": email.lower()},
        )
        return result is not None
    
    async def update_password(self, user_id: str, new_password: str) -> bool:
        """Update user password."""
        hashed_password = get_password_hash(new_password)
        await self.execute(
            """
            UPDATE users
            SET password_hash = :password_hash, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            """,
            {"id": user_id, "password_hash": hashed_password},
        )
        return True
    
    async def deactivate_user(self, user_id: str) -> bool:
        """Deactivate a user account."""
        await self.execute(
            """
            UPDATE users
            SET is_active = false, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            """,
            {"id": user_id},
        )
        return True
    
    async def list_by_role(
        self,
        role: str,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Dict[str, Any]]:
        """List users with specific role"""
        query = """
        SELECT id, email, name, role, phone, is_active, created_at
        FROM users 
        WHERE role = :role::user_role AND is_active = true
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
        """
        return await self.fetch_all(query, {
            "role": role,
            "limit": limit,
            "offset": offset,
        })
    
    async def list_team_members(self, team_id: str) -> List[Dict[str, Any]]:
        """List all users in a team with their roles"""
        query = """
        SELECT u.id, u.email, u.name, u.role, u.phone, tm.role as team_role
        FROM team_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.team_id = :team_id
        ORDER BY tm.role DESC, u.name ASC
        """
        return await self.fetch_all(query, {"team_id": team_id})
    
    async def get_officers_in_department(self, department_id: str) -> List[Dict[str, Any]]:
        """Get all officers assigned to a department"""
        query = """
        SELECT DISTINCT u.id, u.email, u.name, u.phone
        FROM users u
        JOIN team_members tm ON u.id = tm.user_id
        JOIN teams t ON tm.team_id = t.id
        WHERE t.department_id = :department_id 
        AND u.role = 'OFFICER'::user_role
        AND u.is_active = true
        """
        return await self.fetch_all(query, {"department_id": department_id})
