"""Repositories for verification, audit logs, and cluster operations."""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from src.repositories.base import BaseRepository


class VerificationRepository(BaseRepository):
    """Field verification persistence."""

    async def create_verification(
        self,
        grievance_id: str,
        officer_id: str,
        photo_url: str,
        latitude: float,
        longitude: float,
        is_within_tolerance: bool,
        distance_from_incident: float | None = None,
        notes: str | None = None,
        status: str = "PENDING",
    ) -> dict[str, Any] | None:
        return await self.insert(
            """
            INSERT INTO verifications (
                id,
                grievance_id,
                officer_id,
                photo_url,
                latitude,
                longitude,
                distance_from_incident,
                is_within_tolerance,
                status,
                notes,
                created_at
            ) VALUES (
                :id,
                :grievance_id,
                :officer_id,
                :photo_url,
                :latitude,
                :longitude,
                :distance_from_incident,
                :is_within_tolerance,
                :status,
                :notes,
                CURRENT_TIMESTAMP
            )
            RETURNING *
            """,
            {
                "id": str(uuid4()),
                "grievance_id": grievance_id,
                "officer_id": officer_id,
                "photo_url": photo_url,
                "latitude": latitude,
                "longitude": longitude,
                "distance_from_incident": distance_from_incident,
                "is_within_tolerance": is_within_tolerance,
                "status": status,
                "notes": notes,
            },
        )

    async def get_by_grievance(self, grievance_id: str) -> list[dict[str, Any]]:
        return await self.fetch_all(
            """
            SELECT
                v.*,
                u.name AS officer_name,
                u.phone AS officer_phone
            FROM verifications v
            LEFT JOIN users u ON u.id = v.officer_id
            WHERE v.grievance_id = :grievance_id
            ORDER BY v.created_at DESC
            """,
            {"grievance_id": grievance_id},
        )

    async def update_verification_status(
        self,
        verification_id: str,
        status: str,
        notes: str | None = None,
    ) -> dict[str, Any] | None:
        return await self.update(
            """
            UPDATE verifications
            SET
                status = :status,
                notes = COALESCE(:notes, notes)
            WHERE id = :verification_id
            RETURNING *
            """,
            {
                "verification_id": verification_id,
                "status": status,
                "notes": notes,
            },
        )


class AuditLogRepository(BaseRepository):
    """Append-only audit log operations."""

    async def log_event(
        self,
        grievance_id: str,
        event_type: str,
        actor_id: str | None = None,
        old_status: str | None = None,
        new_status: str | None = None,
        description: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> dict[str, Any] | None:
        return await self.insert(
            """
            INSERT INTO audit_logs (
                id,
                grievance_id,
                actor_id,
                event_type,
                old_status,
                new_status,
                description,
                metadata,
                created_at
            ) VALUES (
                :id,
                :grievance_id,
                :actor_id,
                :event_type,
                :old_status,
                :new_status,
                :description,
                :metadata,
                CURRENT_TIMESTAMP
            )
            RETURNING *
            """,
            {
                "id": str(uuid4()),
                "grievance_id": grievance_id,
                "actor_id": actor_id,
                "event_type": event_type,
                "old_status": old_status,
                "new_status": new_status,
                "description": description,
                "metadata": metadata,
            },
        )

    async def get_grievance_history(self, grievance_id: str) -> list[dict[str, Any]]:
        return await self.fetch_all(
            """
            SELECT
                al.id,
                al.event_type,
                al.old_status,
                al.new_status,
                al.description,
                al.metadata,
                al.created_at,
                u.name AS actor_name
            FROM audit_logs al
            LEFT JOIN users u ON u.id = al.actor_id
            WHERE al.grievance_id = :grievance_id
            ORDER BY al.created_at DESC
            """,
            {"grievance_id": grievance_id},
        )


class ClusterRepository(BaseRepository):
    """Geospatial/topic cluster persistence queries."""

    async def list_clusters(
        self,
        cluster_type: str | None = None,
        is_active: bool | None = None,
        limit: int = 100,
    ) -> list[dict[str, Any]]:
        where_clauses: list[str] = []
        params: dict[str, Any] = {"limit": limit}

        if cluster_type:
            where_clauses.append("cluster_type = :cluster_type::cluster_type")
            params["cluster_type"] = cluster_type
        if is_active is not None:
            where_clauses.append("is_active = :is_active")
            params["is_active"] = is_active

        where_clause = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
        return await self.fetch_all(
            f"""
            SELECT
                id,
                cluster_type,
                centroid_lat,
                centroid_lng,
                member_count,
                crisis_score,
                is_active,
                topics,
                metadata,
                created_at,
                updated_at
            FROM geo_clusters
            {where_clause}
            ORDER BY crisis_score DESC NULLS LAST, updated_at DESC
            LIMIT :limit
            """,
            params,
        )

    async def get_cluster_members(self, cluster_id: str, limit: int = 200) -> list[dict[str, Any]]:
        return await self.fetch_all(
            """
            SELECT
                cm.cluster_id,
                cm.grievance_id,
                cm.similarity_score,
                cm.created_at,
                g.grid_id,
                g.title,
                g.category,
                g.priority,
                g.status
            FROM cluster_members cm
            JOIN grievances g ON g.id = cm.grievance_id
            WHERE cm.cluster_id = :cluster_id
            ORDER BY cm.similarity_score DESC NULLS LAST, cm.created_at DESC
            LIMIT :limit
            """,
            {"cluster_id": cluster_id, "limit": limit},
        )

    async def get_crisis_hotspots(self, limit: int = 50) -> list[dict[str, Any]]:
        return await self.fetch_all(
            """
            SELECT
                id,
                cluster_type,
                centroid_lat,
                centroid_lng,
                member_count,
                crisis_score,
                topics,
                metadata,
                updated_at
            FROM geo_clusters
            WHERE is_active = true
            ORDER BY crisis_score DESC NULLS LAST
            LIMIT :limit
            """,
            {"limit": limit},
        )
