from __future__ import annotations

import json
import math
import time
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.redis_client import get_redis_client
from src.repositories.grievances import GrievanceRepository


class RoutingService:
    """Department/team routing and priority queue operations."""

    PRIORITY_SCORES: dict[str, int] = {
        "CRITICAL": 0,
        "HIGH": 1,
        "MEDIUM": 2,
        "LOW": 3,
    }

    def __init__(self, db: AsyncSession) -> None:
        self.repo = GrievanceRepository(db)

    async def _resolve_department_id(self, predicted_department: str | None) -> str | None:
        return await self.repo._resolve_department_id(predicted_department)

    @staticmethod
    def _extract_centroid(service_area: Any) -> tuple[float, float] | None:
        if not isinstance(service_area, dict):
            return None

        geometry_type = str(service_area.get("type") or "").lower()
        coordinates = service_area.get("coordinates")
        if not coordinates:
            return None

        points: list[tuple[float, float]] = []

        def collect_pairs(value: Any) -> None:
            if isinstance(value, list):
                if len(value) >= 2 and all(isinstance(v, (int, float)) for v in value[:2]):
                    lng = float(value[0])
                    lat = float(value[1])
                    points.append((lat, lng))
                    return
                for nested in value:
                    collect_pairs(nested)

        collect_pairs(coordinates)
        if not points:
            return None

        avg_lat = sum(p[0] for p in points) / len(points)
        avg_lng = sum(p[1] for p in points) / len(points)
        return avg_lat, avg_lng

    @staticmethod
    def _distance_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        radius_km = 6371.0
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lng2 - lng1)
        a = (
            math.sin(delta_phi / 2) ** 2
            + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return radius_km * c

    async def find_nearest_available_team(
        self,
        department_id: str,
        latitude: float | None,
        longitude: float | None,
    ) -> dict[str, Any] | None:
        teams = await self.repo.fetch_all(
            """
            SELECT id, name, service_area
            FROM teams
            WHERE department_id = :department_id
              AND is_active = true
            ORDER BY created_at ASC
            """,
            {"department_id": department_id},
        )
        if not teams:
            return None

        if latitude is None or longitude is None:
            return teams[0]

        nearest: dict[str, Any] | None = None
        nearest_km: float | None = None
        for team in teams:
            centroid = self._extract_centroid(team.get("service_area"))
            if centroid is None:
                if nearest is None:
                    nearest = team
                continue

            km = self._distance_km(latitude, longitude, centroid[0], centroid[1])
            if nearest_km is None or km < nearest_km:
                nearest_km = km
                nearest = team

        return nearest or teams[0]

    async def route_grievance(
        self,
        grievance_id: str,
        predicted_department: str | None,
        latitude: float | None,
        longitude: float | None,
    ) -> dict[str, Any]:
        department_id = await self._resolve_department_id(predicted_department)
        if department_id is None:
            department = await self.repo.fetch_one(
                "SELECT id, code FROM departments WHERE is_active = true ORDER BY created_at ASC LIMIT 1"
            )
            if department is None:
                raise ValueError("No active department available for routing")
            department_id = str(department["id"])

        team = await self.find_nearest_available_team(department_id, latitude, longitude)
        team_id = str(team["id"]) if team else None

        updated = await self.repo.update(
            """
            UPDATE grievances
            SET
                assigned_department_id = :department_id,
                assigned_team_id = :team_id,
                status = 'ASSIGNED'::grievance_status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :grievance_id
            RETURNING *
            """,
            {
                "grievance_id": grievance_id,
                "department_id": department_id,
                "team_id": team_id,
            },
        )

        if updated is None:
            raise ValueError("Grievance not found")

        return {
            "grievance": updated,
            "department_id": department_id,
            "team": team,
        }

    async def enqueue_priority(self, grievance_id: str, priority: str) -> float:
        redis = get_redis_client()
        normalized = priority.upper()
        base_score = self.PRIORITY_SCORES.get(normalized, self.PRIORITY_SCORES["MEDIUM"])
        score = float(base_score * 1000000 + int(time.time()))
        await redis.zadd("routing:queue", {grievance_id: score})
        return score

    async def pop_next_grievance(self) -> str | None:
        redis = get_redis_client()
        popped = await redis.zpopmin("routing:queue", count=1)
        if not popped:
            return None
        grievance_id = popped[0][0]
        return str(grievance_id)
