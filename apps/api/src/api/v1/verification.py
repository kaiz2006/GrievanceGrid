"""Field verification endpoint for two-factor resolution validation."""

from __future__ import annotations

import math
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.core.dependencies import get_current_user, require_officer
from src.repositories.grievances import GrievanceRepository
from src.repositories.operations import VerificationRepository
from src.services.storage_service import StorageService

router = APIRouter()


# Distance tolerance in meters for geo-verification
GEO_TOLERANCE_METERS = 50.0


class VerificationRequest(BaseModel):
	grievance_id: str = Field(min_length=1)
	latitude: float = Field(ge=-90, le=90)
	longitude: float = Field(ge=-180, le=180)
	notes: str | None = Field(default=None, max_length=1000)


class VerificationResponse(BaseModel):
	verification_id: str
	is_valid: bool
	distance_from_incident: str
	message: str


def _haversine_distance(
	lat1: float, lng1: float, lat2: float, lng2: float
) -> float:
	"""Calculate distance between two coordinates in meters using Haversine formula."""
	R = 6371000  # Earth's radius in meters

	phi1 = math.radians(lat1)
	phi2 = math.radians(lat2)
	delta_phi = math.radians(lat2 - lat1)
	delta_lambda = math.radians(lng2 - lng1)

	a = (
		math.sin(delta_phi / 2) ** 2
		+ math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
	)
	c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

	return R * c


@router.post("", response_model=VerificationResponse)
async def submit_verification(
	grievance_id: str = Form(...),
	latitude: float = Form(...),
	longitude: float = Form(...),
	notes: str | None = Form(default=None),
	photo: UploadFile = File(...),
	current_user: dict = Depends(require_officer),
	db: AsyncSession = Depends(get_db_session),
) -> VerificationResponse:
	"""
	Submit field verification for grievance resolution.

	This endpoint implements two-factor field verification:
	1. Validates the officer's GPS location is within 50m of the original grievance
	2. Stores the geo-tagged "after" photo as evidence
	3. Updates grievance status to VERIFIED if validation passes

	Args:
		grievance_id: The grievance being verified
		latitude: Officer's current GPS latitude
		longitude: Officer's current GPS longitude
		notes: Optional verification notes
		photo: Geo-tagged "after" photo
		current_user: Authenticated officer
		db: Database session

	Returns:
		Verification result with distance calculation and validity status
	"""
	grievance_repo = GrievanceRepository(db)
	verification_repo = VerificationRepository(db)
	storage = StorageService()

	# Fetch the grievance
	grievance = await grievance_repo.get_by_id(grievance_id)
	if grievance is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	# Check grievance status allows verification
	valid_statuses = {"IN_PROGRESS", "PENDING_VERIFICATION", "RESOLVED"}
	if grievance.get("status") not in valid_statuses:
		raise HTTPException(
			status_code=400,
			detail=f"Cannot verify grievance with status: {grievance.get('status')}"
		)

	# Get original grievance location
	orig_lat = grievance.get("latitude")
	orig_lng = grievance.get("longitude")

	if orig_lat is None or orig_lng is None:
		raise HTTPException(
			status_code=400,
			detail="Original grievance has no location data for verification"
		)

	# Calculate distance from incident
	distance_meters = _haversine_distance(
		float(orig_lat), float(orig_lng),
		latitude, longitude
	)

	# Check if within tolerance
	is_valid = distance_meters <= GEO_TOLERANCE_METERS

	# Store the photo
	photo_url = await storage.save_upload(photo, subdir="verifications")

	# Create verification record
	verification = await verification_repo.create_verification(
		grievance_id=grievance_id,
		officer_id=current_user["id"],
		photo_url=photo_url,
		latitude=latitude,
		longitude=longitude,
		is_within_tolerance=is_valid,
		distance_from_incident=distance_meters,
		notes=notes,
		status="VALID" if is_valid else "INVALID_LOCATION",
	)

	if verification is None:
		raise HTTPException(
			status_code=500,
			detail="Failed to create verification record"
		)

	# Update grievance status if verification passed
	if is_valid:
		await grievance_repo.update_status(
			grievance_id,
			status="VERIFIED",
			notes=f"Field verification passed. Officer was {distance_meters:.1f}m from incident."
		)
		message = "Verification accepted. Grievance marked for closure."
	else:
		await grievance_repo.update_status(
			grievance_id,
			status="PENDING_VERIFICATION",
			notes=f"Field verification failed. Officer was {distance_meters:.1f}m from incident (tolerance: {GEO_TOLERANCE_METERS}m)."
		)
		message = f"Verification rejected. Location is {distance_meters:.1f}m from incident (max: {GEO_TOLERANCE_METERS}m)."

	return VerificationResponse(
		verification_id=str(verification["id"]),
		is_valid=is_valid,
		distance_from_incident=f"{distance_meters:.1f} meters",
		message=message,
	)
