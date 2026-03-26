from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.grievances import GrievanceRepository
from src.core.redis_client import get_redis_client
import json


class GrievanceService:
    """Business logic for grievance CRUD and lifecycle transitions."""

    VALID_TRANSITIONS: dict[str, set[str]] = {
        "CREATED": {"PENDING_CLASSIFICATION", "PENDING_ASSIGNMENT", "ASSIGNED", "ESCALATED", "CLOSED"},
        "PENDING_CLASSIFICATION": {"PENDING_ASSIGNMENT", "ESCALATED", "CLOSED"},
        "PENDING_ASSIGNMENT": {"ASSIGNED", "ESCALATED", "CLOSED"},
        "ASSIGNED": {"IN_PROGRESS", "ESCALATED", "CLOSED"},
        "IN_PROGRESS": {"PENDING_VERIFICATION", "RESOLVED", "ESCALATED", "CLOSED"},
        "PENDING_VERIFICATION": {"VERIFIED", "IN_PROGRESS", "ESCALATED", "CLOSED"},
        "VERIFIED": {"RESOLVED", "ESCALATED", "CLOSED"},
        "RESOLVED": {"CONTESTED", "CLOSED"},
        "ESCALATED": {"ASSIGNED", "IN_PROGRESS", "PENDING_VERIFICATION", "RESOLVED", "CLOSED"},
        "CONTESTED": {"IN_PROGRESS", "RESOLVED", "CLOSED"},
        "CLOSED": set(),
    }

    def __init__(self, db: AsyncSession) -> None:
        self.repo = GrievanceRepository(db)

    @staticmethod
    def generate_grid_id() -> str:
        year = datetime.now(timezone.utc).year
        suffix = uuid4().hex[:6].upper()
        return f"GRI-{year}-{suffix}"

    def validate_status_transition(self, current_status: str, new_status: str) -> bool:
        if current_status == new_status:
            return True
        allowed = self.VALID_TRANSITIONS.get(current_status, set())
        return new_status in allowed

    def transition_error_message(self, current_status: str, new_status: str) -> str:
        allowed = sorted(self.VALID_TRANSITIONS.get(current_status, set()))
        allowed_text = ", ".join(allowed) if allowed else "no further transitions"
        return (
            f"Invalid status transition from {current_status} to {new_status}. "
            f"Allowed transitions: {allowed_text}."
        )

    async def create_grievance(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self.repo.create(payload)

    async def get_grievance(self, grievance_id: str) -> dict[str, Any] | None:
        return await self.repo.get_by_id(grievance_id)

    async def list_grievances(
        self,
        status: str | None = None,
        category: str | None = None,
        priority: str | None = None,
        department_id: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[dict[str, Any]]:
        return await self.repo.list_grievances(
            status=status,
            category=category,
            priority=priority,
            department_id=department_id,
            limit=limit,
            offset=offset,
        )

    async def update_status(
        self,
        grievance_id: str,
        new_status: str,
        notes: str | None = None,
    ) -> dict[str, Any] | None:
        current = await self.repo.fetch_one(
            "SELECT status FROM grievances WHERE id = :grievance_id",
            {"grievance_id": grievance_id},
        )
        if current is None:
            return None

        current_status = str(current.get("status"))
        if not self.validate_status_transition(current_status, new_status):
            raise ValueError(self.transition_error_message(current_status, new_status))

        updated = await self.repo.update_status(grievance_id=grievance_id, status=new_status, notes=notes)
        
        # Broadcast via Redis PubSub for real-time WebSocket updates
        if updated:
            redis = get_redis_client()
            channel = f"grievance:{grievance_id}:updates"
            await redis.publish(channel, json.dumps({
                "type": "status_update",
                "grievance_id": grievance_id,
                "grid_id": updated.get("grid_id"),
                "status": new_status,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "notes": notes
            }))
            
        return updated

    async def delete_grievance(self, grievance_id: str) -> bool:
        return await self.repo.delete_grievance(grievance_id)
