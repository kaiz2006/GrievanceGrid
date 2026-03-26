"""Repository for SLA timer operations."""

from __future__ import annotations

from typing import Any

from src.repositories.base import BaseRepository


class SLARepository(BaseRepository):
    """Deadline tracking and breach monitoring queries."""

    async def get_by_id(self, sla_id: str) -> dict[str, Any] | None:
        return await self.fetch_one(
            """
            SELECT
                id,
                grievance_id,
                sla_type,
                deadline_at,
                breached_at,
                is_breached,
                escalation_level,
                is_escalated,
                created_at,
                updated_at
            FROM sla_timers
            WHERE id = :sla_id
            """,
            {"sla_id": sla_id},
        )

    async def get_by_grievance(self, grievance_id: str) -> list[dict[str, Any]]:
        return await self.fetch_all(
            """
            SELECT
                id,
                grievance_id,
                sla_type,
                deadline_at,
                breached_at,
                is_breached,
                escalation_level,
                is_escalated,
                created_at,
                updated_at
            FROM sla_timers
            WHERE grievance_id = :grievance_id
            ORDER BY deadline_at ASC
            """,
            {"grievance_id": grievance_id},
        )

    async def get_breached_slas(
        self,
        department_id: str | None = None,
        limit: int = 100,
    ) -> list[dict[str, Any]]:
        where_clauses = ["st.is_breached = true"]
        params: dict[str, Any] = {"limit": limit}

        if department_id:
            where_clauses.append("g.assigned_department_id = :department_id")
            params["department_id"] = department_id

        where_clause = f"WHERE {' AND '.join(where_clauses)}"
        return await self.fetch_all(
            f"""
            SELECT
                st.id,
                st.grievance_id,
                st.sla_type,
                st.deadline_at,
                st.breached_at,
                st.escalation_level,
                st.is_escalated,
                g.grid_id,
                g.title,
                g.priority,
                g.status,
                g.location_address
            FROM sla_timers st
            JOIN grievances g ON g.id = st.grievance_id
            {where_clause}
            ORDER BY st.deadline_at ASC
            LIMIT :limit
            """,
            params,
        )

    async def update_breach_status(
        self,
        sla_id: str,
        is_breached: bool,
        escalation_level: int = 0,
    ) -> dict[str, Any] | None:
        return await self.update(
            """
            UPDATE sla_timers
            SET
                is_breached = :is_breached,
                escalation_level = :escalation_level,
                is_escalated = CASE WHEN :escalation_level > 0 THEN true ELSE false END,
                breached_at = CASE
                    WHEN :is_breached = true AND breached_at IS NULL THEN CURRENT_TIMESTAMP
                    WHEN :is_breached = false THEN NULL
                    ELSE breached_at
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :sla_id
            RETURNING *
            """,
            {
                "sla_id": sla_id,
                "is_breached": is_breached,
                "escalation_level": escalation_level,
            },
        )

    async def get_upcoming_deadlines(self, hours_threshold: int = 24) -> list[dict[str, Any]]:
        return await self.fetch_all(
            """
            SELECT
                st.id,
                st.grievance_id,
                st.sla_type,
                st.deadline_at,
                g.grid_id,
                g.title,
                g.assigned_officer_id,
                g.status
            FROM sla_timers st
            JOIN grievances g ON g.id = st.grievance_id
            WHERE st.is_breached = false
              AND st.deadline_at > CURRENT_TIMESTAMP
              AND st.deadline_at <= CURRENT_TIMESTAMP + INTERVAL '1 hour' * :hours_threshold
            ORDER BY st.deadline_at ASC
            """,
            {"hours_threshold": hours_threshold},
        )

    async def get_sla_compliance(self) -> dict[str, Any]:
        """Return overall response/resolution SLA compliance percentages."""
        result = await self.fetch_one(
            """
            SELECT
                ROUND(
                    (
                        COUNT(*) FILTER (WHERE sla_type = 'RESPONSE' AND is_breached = false)::numeric
                        / NULLIF(COUNT(*) FILTER (WHERE sla_type = 'RESPONSE'), 0)
                    ) * 100,
                    2
                ) AS response_sla_met,
                ROUND(
                    (
                        COUNT(*) FILTER (WHERE sla_type = 'RESOLUTION' AND is_breached = false)::numeric
                        / NULLIF(COUNT(*) FILTER (WHERE sla_type = 'RESOLUTION'), 0)
                    ) * 100,
                    2
                ) AS resolution_sla_met
            FROM sla_timers
            """
        )
        return result or {"response_sla_met": 0.0, "resolution_sla_met": 0.0}
