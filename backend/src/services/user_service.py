"""
User Service
"""
from sqlalchemy.orm import Session
from src.models import User
from src.validators.auth_validators import UserCreate, UserUpdate
from src.utils.errors import NotFoundError, ConflictError
import structlog

logger = structlog.get_logger(__name__)

class UserService:
    """Service for user operations"""

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        """Get user by ID"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundError("User")
        return user

    @staticmethod
    def get_user_by_firebase_uid(db: Session, firebase_uid: str) -> User:
        """Get user by Firebase UID"""
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        if not user:
            raise NotFoundError("User")
        return user

    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """Create new user"""
        # Check if user already exists
        existing = db.query(User).filter(User.firebase_uid == user_data.firebase_uid).first()
        if existing:
            raise ConflictError("User already exists")

        user = User(**user_data.dict())
        db.add(user)
        db.commit()
        db.refresh(user)

        logger.info("User created", user_id=user.id, firebase_uid=user.firebase_uid)
        return user

    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserUpdate) -> User:
        """Update user"""
        user = UserService.get_user_by_id(db, user_id)

        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        db.commit()
        db.refresh(user)

        logger.info("User updated", user_id=user.id)
        return user

    @staticmethod
    def get_users_by_role(db: Session, role: str) -> list[User]:
        """Get users by role"""
        return db.query(User).filter(User.role == role, User.is_active == True).all()