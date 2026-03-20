from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.grievances import GrievanceRepository
from src.repositories.slas import SLARepository


class SLAService:
    """SLA deadline creation and escalation checks."""

    PRIORITY_SLA_HOURS: dict[str, tuple[int, int]] = {
        "LOW": (48, 168),
        "MEDIUM": (24, 72),
        "HIGH": (12, 48),
        "CRITICAL": (4, 24),
    }

    def __init__(self, db: AsyncSession) -> None:
        self.sla_repo = SLARepository(db)
        self.grievance_repo = GrievanceRepository(db)

    def get_deadline_policy(self, category: str | None, priority: str | None) -> tuple[int, int]:
        del category  # Category-specific policies can be plugged in when defined.
        normalized = (priority or "MEDIUM").upper()
        return self.PRIORITY_SLA_HOURS.get(normalized, self.PRIORITY_SLA_HOURS["MEDIUM"])

    def calculate_deadlines(
        self,
        category: str | None,
        priority: str | None,
        now: datetime | None = None,
    ) -> dict[str, datetime]:
        base = now or datetime.now(timezone.utc)
        response_hours, resolution_hours = self.get_deadline_policy(category, priority)
        return {
            "response": base + timedelta(hours=response_hours),
            "resolution": base + timedelta(hours=resolution_hours),
        }

    async def create_sla_timers(
        self,
        grievance_id: str,
        category: str | None,
        priority: str | None,
    ) -> dict[str, Any]:
        deadlines = self.calculate_deadlines(category=category, priority=priority)

        response_row = await self.sla_repo.insert(
            """
            INSERT INTO sla_timers (
                id,
                grievance_id,
                sla_type,
                deadline_at,
                is_breached,
                escalation_level,
                is_escalated,
                created_at,
                updated_at
            ) VALUES (
                :id,
                :grievance_id,
                'RESPONSE'::sla_type,
                :deadline_at,
                false,
                0,
                false,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT DO NOTHING
            RETURNING *
            """,
            {
                "id": str(uuid4()),
                "grievance_id": grievance_id,
                "deadline_at": deadlines["response"],
            },
        )

        resolution_row = await self.sla_repo.insert(
            """
            INSERT INTO sla_timers (
                id,
                grievance_id,
                sla_type,
                deadline_at,
                is_breached,
                escalation_level,
                is_escalated,
                created_at,
                updated_at
            ) VALUES (
                :id,
                :grievance_id,
                'RESOLUTION'::sla_type,
                :deadline_at,
                false,
                0,
                false,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT DO NOTHING
            RETURNING *
            """,
            {
                "id": str(uuid4()),
                "grievance_id": grievance_id,
                "deadline_at": deadlines["resolution"],
            },
        )

        return {
            "response_deadline": deadlines["response"],
            "resolution_deadline": deadlines["resolution"],
            "response_timer": response_row,
            "resolution_timer": resolution_row,
        }

    def escalation_threshold(self, sla_type: str, seconds_remaining: int) -> int:
        if seconds_remaining <= 0:
            return 2
        if sla_type == "RESPONSE" and seconds_remaining <= 15 * 60:
            return 2
        if sla_type == "RESOLUTION" and seconds_remaining <= 60 * 60:
            return 1
        return 0

    async def check_and_escalate(self) -> dict[str, Any]:
        now = datetime.now(timezone.utc)
        escalated: list[dict[str, Any]] = []
        breached: list[dict[str, Any]] = []

        active_rows = await self.sla_repo.fetch_all(
            """
            SELECT id, grievance_id, sla_type, deadline_at, is_breached, escalation_level
            FROM sla_timers
            WHERE is_breached = false
            """
        )

        for row in active_rows:
            deadline = row.get("deadline_at")
            if deadline is None:
                continue
            deadline_at = deadline if isinstance(deadline, datetime) else datetime.fromisoformat(str(deadline).replace("Z", "+00:00"))
            seconds_remaining = int((deadline_at - now).total_seconds())
            escalation_level = self.escalation_threshold(str(row.get("sla_type")), seconds_remaining)

            if seconds_remaining <= 0:
                updated = await self.sla_repo.update_breach_status(
                    sla_id=str(row["id"]),
                    is_breached=True,
                    escalation_level=max(2, escalation_level),
                )
                await self.grievance_repo.update_status(
                    grievance_id=str(row["grievance_id"]),
                    status="ESCALATED",
                    notes="SLA breached. Automatic escalation triggered.",
                )
                if updated:
                    breached.append(updated)
                continue

            current_level = int(row.get("escalation_level") or 0)
            if escalation_level > current_level:
                updated = await self.sla_repo.update_breach_status(
                    sla_id=str(row["id"]),
                    is_breached=False,
                    escalation_level=escalation_level,
                )
                if updated:
                    escalated.append(updated)

        return {
            "checked": len(active_rows),
            "escalated_count": len(escalated),
            "breached_count": len(breached),
            "escalated": escalated,
            "breached": breached,
        }
