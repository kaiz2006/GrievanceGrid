"""Repository for grievance database operations."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import UUID, uuid4

from src.repositories.base import BaseRepository


class GrievanceRepository(BaseRepository):
    """Repository for grievance operations backed by PostgreSQL."""

    async def _get_fallback_citizen_id(self) -> str | None:
        return await self.fetch_scalar(
            """
            SELECT id
            FROM users
            WHERE role = 'CITIZEN'::user_role
            ORDER BY created_at ASC
            LIMIT 1
            """
        )

    async def _resolve_department_id(self, department_hint: str | None) -> str | None:
        if not department_hint:
            return None

        candidate = str(department_hint)
        try:
            parsed = UUID(candidate)
            return str(parsed)
        except ValueError:
            pass

        resolved = await self.fetch_scalar(
            """
            SELECT id
            FROM departments
            WHERE code = :hint OR LOWER(name) = LOWER(:hint)
            LIMIT 1
            """,
            {"hint": candidate},
        )
        return str(resolved) if resolved else None

    async def _log_event(
        self,
        grievance_id: str,
        event_type: str,
        description: str,
        old_status: str | None = None,
        new_status: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        await self.execute(
            """
            INSERT INTO audit_logs (
                id,
                grievance_id,
                event_type,
                old_status,
                new_status,
                description,
                metadata,
                created_at
            ) VALUES (
                :id,
                :grievance_id,
                :event_type,
                :old_status::grievance_status,
                :new_status::grievance_status,
                :description,
                :metadata,
                CURRENT_TIMESTAMP
            )
            """,
            {
                "id": str(uuid4()),
                "grievance_id": grievance_id,
                "event_type": event_type,
                "old_status": old_status,
                "new_status": new_status,
                "description": description,
                "metadata": metadata,
            },
        )

    async def create(self, grievance: dict[str, Any]) -> dict[str, Any]:
        """Create a grievance with required defaults and audit event."""
        grievance_id = str(grievance.get("id") or uuid4())
        grid_id = str(grievance.get("grid_id") or grievance.get("gridId") or f"GRI-{datetime.now(timezone.utc).year}-{uuid4().hex[:6].upper()}")
        citizen_id = grievance.get("citizen_id")
        if not citizen_id:
            citizen_id = await self._get_fallback_citizen_id()

        if not citizen_id:
            raise ValueError("No citizen user found. Seed users before creating grievances.")

        category = str(grievance.get("category") or grievance.get("hint_category") or "OTHER")
        priority = str(grievance.get("priority") or grievance.get("hint_priority") or "MEDIUM")
        response_sla_hours = int(grievance.get("response_sla_hours") or 24)
        resolution_sla_hours = int(grievance.get("resolution_sla_hours") or 72)
        response_deadline_at = datetime.now(timezone.utc) + timedelta(hours=response_sla_hours)
        resolution_deadline_at = datetime.now(timezone.utc) + timedelta(hours=resolution_sla_hours)

        created = await self.insert(
            """
            INSERT INTO grievances (
                id,
                grid_id,
                citizen_id,
                title,
                description,
                category,
                priority,
                status,
                latitude,
                longitude,
                location_address,
                before_photo_url,
                voice_recorded,
                voice_url,
                created_at,
                updated_at
            ) VALUES (
                :id,
                :grid_id,
                :citizen_id,
                :title,
                :description,
                :category::grievance_category,
                :priority::priority,
                'CREATED'::grievance_status,
                :latitude,
                :longitude,
                :location_address,
                :before_photo_url,
                :voice_recorded,
                :voice_url,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            RETURNING *
            """,
            {
                "id": grievance_id,
                "grid_id": grid_id,
                "citizen_id": citizen_id,
                "title": grievance.get("title") or "Untitled grievance",
                "description": grievance.get("description") or "No description provided",
                "category": category,
                "priority": priority,
                "latitude": grievance.get("latitude"),
                "longitude": grievance.get("longitude"),
                "location_address": grievance.get("location_address") or grievance.get("location_text"),
                "before_photo_url": grievance.get("before_photo_url"),
                "voice_recorded": bool(grievance.get("voice_recorded") or grievance.get("voice_url")),
                "voice_url": grievance.get("voice_url"),
            },
        )

        if created is None:
            raise ValueError("Unable to create grievance")

        await self.insert(
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
            RETURNING id
            """,
            {
                "id": str(uuid4()),
                "grievance_id": grievance_id,
                "deadline_at": response_deadline_at,
            },
        )

        await self.insert(
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
            RETURNING id
            """,
            {
                "id": str(uuid4()),
                "grievance_id": grievance_id,
                "deadline_at": resolution_deadline_at,
            },
        )

        created["response_deadline"] = response_deadline_at
        created["resolution_deadline"] = resolution_deadline_at

        await self._log_event(
            grievance_id=grievance_id,
            event_type="CREATED",
            old_status=None,
            new_status="CREATED",
            description="Grievance submitted successfully",
        )
        return created

    async def list_grievances(
        self,
        status: str | None = None,
        category: str | None = None,
        priority: str | None = None,
        department_id: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[dict[str, Any]]:
        """List grievances with optional filters."""
        where_clauses: list[str] = []
        params: dict[str, Any] = {"limit": limit, "offset": offset}

        if status:
            where_clauses.append("g.status = :status::grievance_status")
            params["status"] = status
        if category:
            where_clauses.append("g.category = :category::grievance_category")
            params["category"] = category
        if priority:
            where_clauses.append("g.priority = :priority::priority")
            params["priority"] = priority
        if department_id:
            where_clauses.append("g.assigned_department_id = :department_id")
            params["department_id"] = department_id

        where_clause = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        return await self.fetch_all(
            f"""
            SELECT
                g.id,
                g.grid_id,
                g.status,
                g.title,
                g.description,
                g.category,
                g.priority,
                g.ai_category,
                g.ai_priority,
                g.assigned_department_id,
                g.created_at,
                g.updated_at
            FROM grievances g
            {where_clause}
            ORDER BY g.created_at DESC
            LIMIT :limit OFFSET :offset
            """,
            params,
        )

    async def get_by_id(self, grievance_id: str) -> dict[str, Any] | None:
        """Get grievance details by UUID."""
        return await self.fetch_one(
            """
            SELECT
                g.*,
                u.name AS citizen_name,
                u.phone AS citizen_phone,
                d.name AS assigned_department_name,
                t.name AS assigned_team_name
            FROM grievances g
            LEFT JOIN users u ON u.id = g.citizen_id
            LEFT JOIN departments d ON d.id = g.assigned_department_id
            LEFT JOIN teams t ON t.id = g.assigned_team_id
            WHERE g.id = :grievance_id
            """,
            {"grievance_id": grievance_id},
        )

    async def get_by_grid_id(self, grid_id: str) -> dict[str, Any] | None:
        """Get grievance details by public Grid ID."""
        return await self.fetch_one(
            """
            SELECT g.*
            FROM grievances g
            WHERE g.grid_id = :grid_id
            """,
            {"grid_id": grid_id},
        )

    async def get_timeline(self, grievance_id: str) -> list[dict[str, Any]]:
        """Return timeline events from append-only audit log."""
        return await self.fetch_all(
            """
            SELECT
                COALESCE(al.new_status::text, al.event_type) AS status,
                al.created_at AS timestamp,
                al.description,
                al.metadata
            FROM audit_logs al
            WHERE al.grievance_id = :grievance_id
            ORDER BY al.created_at ASC
            """,
            {"grievance_id": grievance_id},
        )

    async def update_status(
        self,
        grievance_id: str,
        status: str,
        notes: str | None = None,
    ) -> dict[str, Any] | None:
        """Update grievance status and append audit event."""
        existing = await self.fetch_one(
            "SELECT status FROM grievances WHERE id = :grievance_id",
            {"grievance_id": grievance_id},
        )
        if existing is None:
            return None

        updated = await self.update(
            """
            UPDATE grievances
            SET
                status = :status::grievance_status,
                updated_at = CURRENT_TIMESTAMP,
                resolved_at = CASE
                    WHEN :status IN ('RESOLVED', 'CLOSED') THEN CURRENT_TIMESTAMP
                    ELSE resolved_at
                END
            WHERE id = :grievance_id
            RETURNING *
            """,
            {
                "grievance_id": grievance_id,
                "status": status,
            },
        )

        if updated:
            await self._log_event(
                grievance_id=grievance_id,
                event_type="STATUS_CHANGED",
                old_status=str(existing.get("status")) if existing.get("status") else None,
                new_status=status,
                description=notes or f"Status updated to {status}",
            )

        return updated

    async def add_feedback(
        self,
        grievance_id: str,
        rating: int,
        comment: str | None = None,
        is_satisfied: bool | None = None,
    ) -> dict[str, Any] | None:
        """Store citizen feedback fields on the grievance row."""
        feedback_text = comment
        if feedback_text is None and is_satisfied is not None:
            feedback_text = "Citizen marked satisfaction" if is_satisfied else "Citizen marked dissatisfaction"

        updated = await self.update(
            """
            UPDATE grievances
            SET
                citizen_feedback_rating = :rating,
                citizen_feedback_text = :feedback_text,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :grievance_id
            RETURNING *
            """,
            {
                "grievance_id": grievance_id,
                "rating": rating,
                "feedback_text": feedback_text,
            },
        )
        if updated:
            await self._log_event(
                grievance_id=grievance_id,
                event_type="UPDATED",
                description=f"Citizen feedback received with rating {rating}/5",
                metadata={"is_satisfied": is_satisfied},
            )
        return updated

    async def mark_contested(
        self,
        grievance_id: str,
        reason: str,
        evidence_photo: str | None = None,
        audit_id: str | None = None,
        audit_task_id: str | None = None,
    ) -> dict[str, Any] | None:
        """Mark grievance contested and persist contest metadata."""
        updated = await self.update(
            """
            UPDATE grievances
            SET
                is_contested = true,
                contest_reason = :reason,
                contest_evidence_url = :evidence_photo,
                status = 'CONTESTED'::grievance_status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :grievance_id
            RETURNING *
            """,
            {
                "grievance_id": grievance_id,
                "reason": reason,
                "evidence_photo": evidence_photo,
            },
        )
        if updated:
            await self._log_event(
                grievance_id=grievance_id,
                event_type="CONTESTED",
                old_status=None,
                new_status="CONTESTED",
                description="Citizen contested resolution and audit triggered",
                metadata={"audit_id": audit_id, "audit_task_id": audit_task_id},
            )
        return updated

    async def assign_department(self, grievance_id: str, department_id: str) -> dict[str, Any] | None:
        """Assign grievance to a department and move workflow state."""
        updated = await self.update(
            """
            UPDATE grievances
            SET
                assigned_department_id = :department_id,
                status = 'ASSIGNED'::grievance_status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :grievance_id
            RETURNING *
            """,
            {
                "grievance_id": grievance_id,
                "department_id": department_id,
            },
        )
        if updated:
            await self._log_event(
                grievance_id=grievance_id,
                event_type="ASSIGNED",
                new_status="ASSIGNED",
                description="Grievance assigned to department",
                metadata={"department_id": department_id},
            )
        return updated

    async def update_ai_result(self, grievance_id: str, ai_result: dict[str, Any]) -> dict[str, Any] | None:
        """Update AI classification fields from worker callback payload."""
        ai_category = ai_result.get("ai_category") or ai_result.get("category") or "OTHER"
        ai_priority = ai_result.get("ai_priority") or ai_result.get("priority") or "MEDIUM"
        assigned_department_id = await self._resolve_department_id(ai_result.get("assigned_department"))

        updated = await self.update(
            """
            UPDATE grievances
            SET
                ai_category = :ai_category::grievance_category,
                ai_priority = :ai_priority::priority,
                ai_summary = :ai_summary,
                damage_severity = :damage_severity,
                assigned_department_id = COALESCE(:assigned_department_id, assigned_department_id),
                similar_cases_count = :similar_cases_count,
                status = 'PENDING_ASSIGNMENT'::grievance_status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :grievance_id
            RETURNING *
            """,
            {
                "grievance_id": grievance_id,
                "ai_category": ai_category,
                "ai_priority": ai_priority,
                "ai_summary": ai_result.get("ai_summary"),
                "damage_severity": ai_result.get("damage_severity"),
                "assigned_department_id": assigned_department_id,
                "similar_cases_count": len(ai_result.get("similar_cases") or []),
            },
        )
        if updated:
            await self._log_event(
                grievance_id=grievance_id,
                event_type="UPDATED",
                new_status="PENDING_ASSIGNMENT",
                description="AI classification completed",
                metadata={
                    "ai_category": ai_category,
                    "ai_priority": ai_priority,
                    "vector_indexed": ai_result.get("vector_indexed"),
                },
            )
        return updated

    async def update_voice_result(self, grievance_id: str, voice_result: dict[str, Any]) -> dict[str, Any] | None:
        """Update grievance from voice processing callback."""
        summary = voice_result.get("summary") or voice_result.get("transcription")
        updated = await self.update(
            """
            UPDATE grievances
            SET
                voice_recorded = true,
                voice_url = COALESCE(:audio_url, voice_url),
                ai_summary = COALESCE(:summary, ai_summary),
                ai_category = COALESCE(:ai_category::grievance_category, ai_category),
                ai_priority = COALESCE(:ai_priority::priority, ai_priority),
                status = 'PENDING_ASSIGNMENT'::grievance_status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :grievance_id
            RETURNING *
            """,
            {
                "grievance_id": grievance_id,
                "audio_url": voice_result.get("audio_url"),
                "summary": summary,
                "ai_category": voice_result.get("ai_category"),
                "ai_priority": voice_result.get("ai_priority"),
            },
        )
        if updated:
            await self._log_event(
                grievance_id=grievance_id,
                event_type="UPDATED",
                new_status="PENDING_ASSIGNMENT",
                description="Voice grievance processed and enriched",
            )
        return updated

    async def persist_notification_delivery(
        self,
        grievance_id: str,
        status: str,
        delivery_report: dict[str, Any],
    ) -> dict[str, Any] | None:
        """Persist worker notification outcomes as append-only audit metadata."""
        existing = await self.fetch_one(
            "SELECT id, status, updated_at FROM grievances WHERE id = :grievance_id",
            {"grievance_id": grievance_id},
        )
        if existing is None:
            return None

        await self._log_event(
            grievance_id=grievance_id,
            event_type="NOTIFICATION_DELIVERY",
            old_status=None,
            new_status=status,
            description=f"Notification delivery attempted for status {status}",
            metadata=delivery_report,
        )
        return existing

    async def delete_grievance(self, grievance_id: str) -> bool:
        """Delete a grievance row by id."""
        deleted_count = await self.delete(
            "DELETE FROM grievances WHERE id = :grievance_id",
            {"grievance_id": grievance_id},
        )
        return deleted_count > 0

    async def get_dashboard_summary(self, from_date: str | None = None, to_date: str | None = None) -> dict[str, Any]:
        """Aggregate top-level dashboard metrics."""
        where_clause = ""
        params: dict[str, Any] = {}
        if from_date and to_date:
            where_clause = "WHERE g.created_at BETWEEN :from_date::timestamptz AND :to_date::timestamptz"
            params["from_date"] = from_date
            params["to_date"] = to_date

        summary = await self.fetch_one(
            f"""
            SELECT
                COUNT(*)::int AS total_grievances,
                COUNT(*) FILTER (WHERE g.status = 'RESOLVED')::int AS resolved,
                COUNT(*) FILTER (WHERE g.status NOT IN ('RESOLVED', 'CLOSED'))::int AS pending,
                COUNT(*) FILTER (WHERE g.status = 'ESCALATED')::int AS escalated,
                ROUND(
                    AVG(
                        CASE
                            WHEN g.resolved_at IS NOT NULL THEN EXTRACT(EPOCH FROM (g.resolved_at - g.created_at)) / 3600
                            ELSE NULL
                        END
                    )::numeric,
                    2
                ) AS avg_resolution_hours
            FROM grievances g
            {where_clause}
            """,
            params,
        )
        return summary or {
            "total_grievances": 0,
            "resolved": 0,
            "pending": 0,
            "escalated": 0,
            "avg_resolution_hours": None,
        }

    async def get_counts_by_category(self, from_date: str | None = None, to_date: str | None = None) -> list[dict[str, Any]]:
        """Aggregate counts grouped by grievance category."""
        where_clause = ""
        params: dict[str, Any] = {}
        if from_date and to_date:
            where_clause = "WHERE created_at BETWEEN :from_date::timestamptz AND :to_date::timestamptz"
            params["from_date"] = from_date
            params["to_date"] = to_date

        return await self.fetch_all(
            f"""
            SELECT
                category,
                COUNT(*)::int AS count,
                COUNT(*) FILTER (WHERE status = 'RESOLVED')::int AS resolved
            FROM grievances
            {where_clause}
            GROUP BY category
            ORDER BY count DESC
            """,
            params,
        )

    async def get_counts_by_priority(self, from_date: str | None = None, to_date: str | None = None) -> list[dict[str, Any]]:
        """Aggregate counts grouped by priority with avg resolution time."""
        where_clause = ""
        params: dict[str, Any] = {}
        if from_date and to_date:
            where_clause = "WHERE created_at BETWEEN :from_date::timestamptz AND :to_date::timestamptz"
            params["from_date"] = from_date
            params["to_date"] = to_date

        return await self.fetch_all(
            f"""
            SELECT
                priority,
                COUNT(*)::int AS count,
                ROUND(
                    AVG(
                        CASE
                            WHEN resolved_at IS NOT NULL THEN EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
                            ELSE NULL
                        END
                    )::numeric,
                    2
                ) AS avg_resolution_hours
            FROM grievances
            {where_clause}
            GROUP BY priority
            ORDER BY count DESC
            """,
            params,
        )

    async def get_heat_map_data(self, limit: int = 200) -> list[dict[str, Any]]:
        """Return point data for heat-map visualizations."""
        return await self.fetch_all(
            """
            SELECT
                latitude::float AS lat,
                longitude::float AS lng,
                CASE priority
                    WHEN 'CRITICAL' THEN 1.0
                    WHEN 'HIGH' THEN 0.8
                    WHEN 'MEDIUM' THEN 0.6
                    ELSE 0.4
                END AS intensity
            FROM grievances
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
            ORDER BY created_at DESC
            LIMIT :limit
            """,
            {"limit": limit},
        )

    async def get_predictive_alerts(self, risk_threshold: float = 0.75, limit: int = 20) -> list[dict[str, Any]]:
        """Return high-risk infrastructure alerts for analytics dashboards."""
        return await self.fetch_all(
            """
            SELECT
                id,
                department_id,
                asset_type,
                asset_name,
                location_lat,
                location_lng,
                complaint_count_7d,
                complaint_count_30d,
                unresolved_count,
                failure_risk_score,
                predicted_failure_date,
                updated_at
            FROM infrastructure_assets
            WHERE is_active = true
              AND failure_risk_score IS NOT NULL
              AND failure_risk_score >= :risk_threshold
            ORDER BY failure_risk_score DESC, updated_at DESC
            LIMIT :limit
            """,
            {
                "risk_threshold": risk_threshold,
                "limit": limit,
            },
        )
