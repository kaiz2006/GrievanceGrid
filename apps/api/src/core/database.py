import logging
import asyncio
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from src.core.config import settings

logger = logging.getLogger(__name__)

# PostgreSQL async connection string
DATABASE_URL = settings.database_url

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args={"command_timeout": 5} # asyncpg specific: 5s timeout for commands
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    """Base class for SQLAlchemy models"""
    pass

class MockSession:
    """A mock session that returns empty results instead of crashing when DB is offline."""
    async def __aenter__(self): return self
    async def __aexit__(self, *args): pass
    async def execute(self, statement, params=None):
        logger.warning(f"DB OFFLINE (MOCK): {statement}")
        class MockResult:
            def first(self): return None
            def fetchall(self): return []
            def rowcount(self): return 0
            def __iter__(self): return iter([])
        return MockResult()
    async def commit(self): pass
    async def rollback(self): pass
    async def close(self): pass

async def get_db_session():
    """
    Dependency for getting database session. Fallback to MockSession if DB fails.
    """
    session = None
    try:
        async with AsyncSessionLocal() as db_session:
            # Try to ping DB with a strict timeout
            try:
                await asyncio.wait_for(db_session.execute(text("SELECT 1")), timeout=2.0)
                session = db_session
            except (asyncio.TimeoutError, Exception) as ping_err:
                logger.error(f"DB PING FAILED: {ping_err}. Falling back to MockSession.")
                session = MockSession()
            
            yield session
    except Exception as e:
        logger.error(f"SESSION ERROR: {e}. Falling back to MockSession.")
        if session is None:
            yield MockSession()
    finally:
        # FastAPI handles closing the session if it's a real session
        pass

async def init_db():
    """Initialize database tables. Catch errors to prevent startup crash."""
    try:
        async with engine.begin() as conn:
            # Also use a timeout here
            await asyncio.wait_for(conn.run_sync(Base.metadata.create_all), timeout=5.0)
    except Exception as e:
        logger.error(f"Failed to initialize database (Safe Mode active): {e}")

async def close_db():
    """Close database connections"""
    try:
        await asyncio.wait_for(engine.dispose(), timeout=2.0)
    except:
        pass
