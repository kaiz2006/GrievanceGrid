"""
Base repository class with common database operations
"""
from typing import Any, Dict, List, Optional, TypeVar, Generic
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")


class BaseRepository(Generic[T]):
    """
    Generic base repository for common CRUD operations.
    Subclasses implement entity-specific logic.
    """
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def fetch_one(self, query: str, params: Optional[Dict] = None) -> Optional[Dict[str, Any]]:
        """Execute a SELECT query that returns one row"""
        result = await self.db.execute(text(query), params or {})
        row = result.first()
        return dict(row._mapping) if row else None
    
    async def fetch_all(self, query: str, params: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """Execute a SELECT query that returns multiple rows"""
        result = await self.db.execute(text(query), params or {})
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    
    async def fetch_scalar(self, query: str, params: Optional[Dict] = None) -> Any:
        """Execute a SELECT query that returns a single value"""
        result = await self.db.execute(text(query), params or {})
        row = result.first()
        return row[0] if row else None
    
    async def insert(self, query: str, params: Optional[Dict] = None) -> Optional[Dict[str, Any]]:
        """Execute an INSERT query with RETURNING clause"""
        result = await self.db.execute(text(query), params or {})
        row = result.first()
        await self.db.commit()
        return dict(row._mapping) if row else None
    
    async def insert_many(self, query: str, params: Optional[List[Dict]] = None) -> List[Dict[str, Any]]:
        """Execute multiple INSERTs with RETURNING clause"""
        result = await self.db.execute(text(query), params or [])
        rows = result.fetchall()
        await self.db.commit()
        return [dict(row._mapping) for row in rows]
    
    async def update(self, query: str, params: Optional[Dict] = None) -> Optional[Dict[str, Any]]:
        """Execute an UPDATE query with RETURNING clause"""
        result = await self.db.execute(text(query), params or {})
        row = result.first()
        await self.db.commit()
        return dict(row._mapping) if row else None
    
    async def delete(self, query: str, params: Optional[Dict] = None) -> int:
        """Execute a DELETE query and return number of rows affected"""
        result = await self.db.execute(text(query), params or {})
        await self.db.commit()
        return result.rowcount
    
    async def execute(self, query: str, params: Optional[Dict] = None) -> None:
        """Execute a query without returning results"""
        await self.db.execute(text(query), params or {})
        await self.db.commit()
