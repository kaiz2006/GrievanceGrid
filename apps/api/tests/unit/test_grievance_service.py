from __future__ import annotations

import pytest

from src.services.grievance_service import GrievanceService


class RepoStub:
    def __init__(self, current_status: str | None = "CREATED") -> None:
        self.current_status = current_status
        self.updated_payload: dict | None = None

    async def fetch_one(self, query: str, params: dict):
        if self.current_status is None:
            return None
        return {"status": self.current_status}

    async def update_status(self, grievance_id: str, status: str, notes: str | None = None):
        self.updated_payload = {
            "grievance_id": grievance_id,
            "status": status,
            "notes": notes,
        }
        return self.updated_payload


@pytest.mark.asyncio
async def test_update_status_rejects_invalid_transition() -> None:
    service = GrievanceService(db=None)
    service.repo = RepoStub(current_status="CREATED")

    with pytest.raises(ValueError) as exc:
        await service.update_status("g-1", "VERIFIED")

    assert "Invalid status transition" in str(exc.value)


@pytest.mark.asyncio
async def test_update_status_allows_valid_transition() -> None:
    service = GrievanceService(db=None)
    service.repo = RepoStub(current_status="CREATED")

    result = await service.update_status("g-2", "ASSIGNED", notes="Assigned to team")

    assert result is not None
    assert result["status"] == "ASSIGNED"
    assert service.repo.updated_payload is not None
    assert service.repo.updated_payload["notes"] == "Assigned to team"


@pytest.mark.asyncio
async def test_update_status_returns_none_when_not_found() -> None:
    service = GrievanceService(db=None)
    service.repo = RepoStub(current_status=None)

    result = await service.update_status("missing", "ASSIGNED")

    assert result is None


def test_generate_grid_id_format() -> None:
    service = GrievanceService(db=None)
    grid_id = service.generate_grid_id()

    assert grid_id.startswith("GRI-")
    assert len(grid_id.split("-")) == 3
