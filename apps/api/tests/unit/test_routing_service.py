from __future__ import annotations

import pytest

from src.services.routing_service import RoutingService


class RepoStub:
    def __init__(self) -> None:
        self.updated: dict | None = None

    async def _resolve_department_id(self, predicted_department: str | None):
        if predicted_department == "PUBLIC_WORKS":
            return "dept-1"
        return None

    async def fetch_one(self, query: str, params: dict | None = None):
        return {"id": "dept-fallback", "code": "FALLBACK"}

    async def fetch_all(self, query: str, params: dict):
        return [
            {
                "id": "team-1",
                "name": "Team Alpha",
                "service_area": {
                    "type": "Polygon",
                    "coordinates": [
                        [[77.5900, 12.9700], [77.6000, 12.9700], [77.6000, 12.9800], [77.5900, 12.9800], [77.5900, 12.9700]]
                    ],
                },
            }
        ]

    async def update(self, query: str, params: dict):
        self.updated = {
            "id": params["grievance_id"],
            "assigned_department_id": params["department_id"],
            "assigned_team_id": params["team_id"],
            "status": "ASSIGNED",
        }
        return self.updated


@pytest.mark.asyncio
async def test_route_grievance_assigns_department_and_team() -> None:
    service = RoutingService(db=None)
    service.repo = RepoStub()

    result = await service.route_grievance(
        grievance_id="g-route-1",
        predicted_department="PUBLIC_WORKS",
        latitude=12.9716,
        longitude=77.5946,
    )

    assert result["department_id"] == "dept-1"
    assert result["team"]["id"] == "team-1"
    assert service.repo.updated is not None
    assert service.repo.updated["status"] == "ASSIGNED"


def test_extract_centroid_and_distance_helpers() -> None:
    service = RoutingService(db=None)
    centroid = service._extract_centroid(
        {
            "type": "Polygon",
            "coordinates": [
                [[77.59, 12.97], [77.60, 12.97], [77.60, 12.98], [77.59, 12.98], [77.59, 12.97]]
            ],
        }
    )

    assert centroid is not None
    km = service._distance_km(12.9716, 77.5946, centroid[0], centroid[1])
    assert km >= 0.0
