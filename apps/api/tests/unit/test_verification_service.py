from __future__ import annotations

import pytest

from src.services.verification_service import VerificationService


class GrievanceRepoStub:
    def __init__(self, grievance: dict | None = None) -> None:
        self.grievance = grievance
        self.updated_statuses: list[dict] = []

    async def get_by_id(self, grievance_id: str) -> dict | None:
        return self.grievance

    async def update_status(self, grievance_id: str, status: str, notes: str) -> dict:
        payload = {"grievance_id": grievance_id, "status": status, "notes": notes}
        self.updated_statuses.append(payload)
        return payload


class VerificationRepoStub:
    def __init__(self) -> None:
        self.created: list[dict] = []

    async def create_verification(self, **kwargs):
        self.created.append(kwargs)
        return {"id": "ver-1", **kwargs}


@pytest.mark.asyncio
async def test_verify_photo_location_within_tolerance_sets_verified() -> None:
    service = VerificationService(db=None)
    grievance_repo = GrievanceRepoStub(grievance={"id": "g-1", "latitude": 12.9716, "longitude": 77.5946})
    verification_repo = VerificationRepoStub()
    service.grievance_repo = grievance_repo
    service.verification_repo = verification_repo

    result = await service.verify_photo_location(
        grievance_id="g-1",
        officer_id="o-1",
        photo_url="https://example.com/photo.jpg",
        photo_latitude=12.9717,
        photo_longitude=77.5947,
        tolerance_meters=50.0,
    )

    assert result["is_within_tolerance"] is True
    assert result["updated_grievance_status"] == "VERIFIED"
    assert grievance_repo.updated_statuses[0]["status"] == "VERIFIED"
    assert verification_repo.created[0]["status"] == "VERIFIED"


@pytest.mark.asyncio
async def test_verify_photo_location_outside_tolerance_sets_pending_verification() -> None:
    service = VerificationService(db=None)
    grievance_repo = GrievanceRepoStub(grievance={"id": "g-2", "latitude": 12.9716, "longitude": 77.5946})
    verification_repo = VerificationRepoStub()
    service.grievance_repo = grievance_repo
    service.verification_repo = verification_repo

    result = await service.verify_photo_location(
        grievance_id="g-2",
        officer_id="o-2",
        photo_url="https://example.com/photo.jpg",
        photo_latitude=12.9816,
        photo_longitude=77.6046,
        tolerance_meters=50.0,
    )

    assert result["is_within_tolerance"] is False
    assert result["distance_from_incident_meters"] > 50.0
    assert result["updated_grievance_status"] == "PENDING_VERIFICATION"
    assert grievance_repo.updated_statuses[0]["status"] == "PENDING_VERIFICATION"
    assert verification_repo.created[0]["status"] == "REJECTED"


def test_distance_calculation_respects_50_meter_boundary() -> None:
    service = VerificationService(db=None)
    distance = service.calculate_distance_meters(12.9716, 77.5946, 12.97195, 77.5946)

    assert 35.0 <= distance <= 45.0
    assert service.is_within_tolerance(distance, tolerance_meters=50.0) is True
    assert service.is_within_tolerance(51.0, tolerance_meters=50.0) is False
