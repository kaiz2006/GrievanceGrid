from __future__ import annotations

import math
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.grievances import GrievanceRepository
from src.repositories.operations import VerificationRepository


class VerificationService:
    """Geo-verification workflows for field evidence submissions."""

    def __init__(self, db: AsyncSession) -> None:
        self.grievance_repo = GrievanceRepository(db)
        self.verification_repo = VerificationRepository(db)

    @staticmethod
    def calculate_distance_meters(
        incident_lat: float,
        incident_lng: float,
        proof_lat: float,
        proof_lng: float,
    ) -> float:
        radius_m = 6371000.0
        phi1 = math.radians(incident_lat)
        phi2 = math.radians(proof_lat)
        delta_phi = math.radians(proof_lat - incident_lat)
        delta_lambda = math.radians(proof_lng - incident_lng)

        a = (
            math.sin(delta_phi / 2) ** 2
            + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return radius_m * c

    def is_within_tolerance(
        self,
        distance_meters: float,
        tolerance_meters: float = 50.0,
    ) -> bool:
        return distance_meters <= tolerance_meters

    async def verify_photo_location(
        self,
        grievance_id: str,
        officer_id: str,
        photo_url: str,
        photo_latitude: float,
        photo_longitude: float,
        notes: str | None = None,
        tolerance_meters: float = 50.0,
    ) -> dict[str, Any]:
        grievance = await self.grievance_repo.get_by_id(grievance_id)
        if grievance is None:
            raise ValueError("Grievance not found")

        incident_lat_raw = grievance.get("latitude")
        incident_lng_raw = grievance.get("longitude")
        if incident_lat_raw is None or incident_lng_raw is None:
            raise ValueError("Grievance does not have incident coordinates")

        incident_lat = float(incident_lat_raw)
        incident_lng = float(incident_lng_raw)
        distance = self.calculate_distance_meters(
            incident_lat=incident_lat,
            incident_lng=incident_lng,
            proof_lat=photo_latitude,
            proof_lng=photo_longitude,
        )
        within = self.is_within_tolerance(distance, tolerance_meters=tolerance_meters)

        verification_status = "VERIFIED" if within else "REJECTED"
        verification = await self.verification_repo.create_verification(
            grievance_id=grievance_id,
            officer_id=officer_id,
            photo_url=photo_url,
            latitude=photo_latitude,
            longitude=photo_longitude,
            is_within_tolerance=within,
            distance_from_incident=distance,
            notes=notes,
            status=verification_status,
        )

        grievance_status = "VERIFIED" if within else "PENDING_VERIFICATION"
        await self.grievance_repo.update_status(
            grievance_id=grievance_id,
            status=grievance_status,
            notes="Verification passed" if within else "Verification outside distance tolerance",
        )

        return {
            "verification": verification,
            "distance_from_incident_meters": round(distance, 2),
            "is_within_tolerance": within,
            "tolerance_meters": tolerance_meters,
            "updated_grievance_status": grievance_status,
        }
