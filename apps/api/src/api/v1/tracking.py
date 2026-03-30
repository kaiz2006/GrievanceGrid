from __future__ import annotations

import asyncio
import json
import logging
import math
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.database import get_db_session
from src.core.redis_client import get_pubsub_redis_client, get_redis_client
from src.repositories.grievances import GrievanceRepository
from src.repositories.slas import SLARepository

router = APIRouter()
logger = logging.getLogger(__name__)


class TeamLocation(BaseModel):
	latitude: float
	longitude: float
	updated_at: str | None = None


class TrackingResponse(BaseModel):
	grid_id: str
	status: str
	current_status: str
	created_at: str | None = None
	current_sla_type: str | None = None
	sla_remaining_seconds: int | None = None
	sla_deadlines: dict[str, str]
	timeline: list[dict[str, Any]]
	assigned_team_location: TeamLocation | None = None
	predicted_eta_minutes: int | None = None


def _to_datetime(value: Any) -> datetime:
	if isinstance(value, datetime):
		return value
	return datetime.fromisoformat(str(value).replace("Z", "+00:00"))


def _safe_float(value: Any) -> float | None:
	if value is None:
		return None
	try:
		return float(value)
	except (TypeError, ValueError):
		return None


async def _close_resource(resource: Any) -> None:
	"""Close async/sync Redis resources across redis-py versions."""
	close_fn = getattr(resource, "aclose", None) or getattr(resource, "close", None)
	if close_fn is None:
		return
	result = close_fn()
	if asyncio.iscoroutine(result):
		await result


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
	radius_km = 6371.0
	phi1, phi2 = math.radians(lat1), math.radians(lat2)
	delta_phi = math.radians(lat2 - lat1)
	delta_lambda = math.radians(lng2 - lng1)

	a = (
		math.sin(delta_phi / 2) ** 2
		+ math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
	)
	c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
	return radius_km * c


def _estimate_eta_minutes(
	grievance_lat: float,
	grievance_lng: float,
	team_lat: float,
	team_lng: float,
) -> int:
	# Conservative city-response speed for field teams.
	average_speed_kmh = 30.0
	km = _haversine_km(team_lat, team_lng, grievance_lat, grievance_lng)
	hours = km / average_speed_kmh
	return max(1, math.ceil(hours * 60))


async def _fetch_team_live_location(team_id: str) -> TeamLocation | None:
	key = f"{settings.team_location_prefix}:{team_id}:location"
	redis = get_redis_client()

	raw = await redis.get(key)
	if raw:
		try:
			payload = json.loads(raw)
		except json.JSONDecodeError:
			payload = None
		if isinstance(payload, dict):
			lat = _safe_float(payload.get("latitude") or payload.get("lat"))
			lng = _safe_float(payload.get("longitude") or payload.get("lng"))
			if lat is not None and lng is not None:
				return TeamLocation(
					latitude=lat,
					longitude=lng,
					updated_at=str(payload.get("updated_at") or payload.get("timestamp") or ""),
				)

	hash_payload = await redis.hgetall(key)
	if hash_payload:
		lat = _safe_float(hash_payload.get("latitude") or hash_payload.get("lat"))
		lng = _safe_float(hash_payload.get("longitude") or hash_payload.get("lng"))
		if lat is not None and lng is not None:
			return TeamLocation(
				latitude=lat,
				longitude=lng,
				updated_at=str(hash_payload.get("updated_at") or hash_payload.get("timestamp") or ""),
			)

	return None


@router.get("/{grid_id}", response_model=TrackingResponse)
async def track_grievance(
	grid_id: str,
	db: AsyncSession = Depends(get_db_session),
) -> TrackingResponse:
	repo = GrievanceRepository(db)
	sla_repo = SLARepository(db)
	grievance = await repo.get_by_grid_id(grid_id)
	if grievance is None:
		raise HTTPException(status_code=404, detail="Grid ID not found")
	timeline = await repo.get_timeline(str(grievance["id"]))

	sla_rows = await sla_repo.get_by_grievance(str(grievance["id"]))
	now = datetime.now(timezone.utc)
	current_sla_type: str | None = None
	sla_remaining_seconds: int | None = None
	sla_deadlines: dict[str, str] = {}

	for sla in sla_rows:
		sla_type = str(sla.get("sla_type"))
		deadline_raw = sla.get("deadline_at")
		if deadline_raw is None:
			continue
		deadline_at = _to_datetime(deadline_raw)
		sla_deadlines[sla_type] = deadline_at.isoformat()
		if bool(sla.get("is_breached")):
			continue
		remaining = int((deadline_at - now).total_seconds())
		if sla_remaining_seconds is None or remaining < sla_remaining_seconds:
			sla_remaining_seconds = remaining
			current_sla_type = sla_type

	team_location: TeamLocation | None = None
	predicted_eta_minutes: int | None = None
	assigned_team_id = grievance.get("assigned_team_id")
	grievance_lat = _safe_float(grievance.get("latitude"))
	grievance_lng = _safe_float(grievance.get("longitude"))
	if assigned_team_id:
		try:
			team_location = await _fetch_team_live_location(str(assigned_team_id))
		except Exception as exc:
			logger.warning("Unable to fetch team location", extra={"error": str(exc), "team_id": str(assigned_team_id)})

	if team_location and grievance_lat is not None and grievance_lng is not None:
		predicted_eta_minutes = _estimate_eta_minutes(
			grievance_lat,
			grievance_lng,
			team_location.latitude,
			team_location.longitude,
		)

	return TrackingResponse(
		grid_id=grievance["grid_id"],
		status=grievance["status"],
		current_status=grievance["status"],
		created_at=_to_datetime(grievance["created_at"]).isoformat(),
		current_sla_type=current_sla_type,
		sla_remaining_seconds=sla_remaining_seconds,
		sla_deadlines=sla_deadlines,
		timeline=[
			{
				"status": str(event.get("status") or "UPDATED"),
				"timestamp": str(event.get("timestamp")),
				"description": str(event.get("description") or "Status updated"),
			}
			for event in timeline
		],
		assigned_team_location=team_location,
		predicted_eta_minutes=predicted_eta_minutes,
	)


async def tracking_ws_handler(
	websocket: WebSocket,
	grid_id: str,
	db: AsyncSession = Depends(get_db_session),
) -> None:
	"""
	WebSocket handler for real-time grievance tracking.
	Safely handles disconnections and exceptions to prevent backend crashes.
	"""
	await websocket.accept()

	repo = GrievanceRepository(db)
	try:
		grievance = await repo.get_by_grid_id(grid_id)
	except Exception as exc:
		logger.error(f"Failed to fetch grievance: {exc}", extra={"grid_id": grid_id})
		await websocket.send_json({"error": "Failed to load grievance"})
		await websocket.close(code=1011)
		return

	if grievance is None:
		await websocket.send_json({"error": "Grid ID not found"})
		await websocket.close(code=1008)
		return

	grievance_id = str(grievance["id"])
	channel = f"grievance:{grievance_id}:updates"
	redis = None
	pubsub = None

	try:
		redis = get_pubsub_redis_client()
		pubsub = redis.pubsub()
		await pubsub.subscribe(channel)

		try:
			await websocket.send_json(
				{
					"type": "subscription",
					"status": "connected",
					"grid_id": grid_id,
					"channel": channel,
				}
			)
		except Exception as exc:
			logger.warning(f"Failed to send subscription confirmation: {exc}", extra={"grid_id": grid_id})

		# Main message loop - catch all exceptions to prevent crashes
		while True:
			try:
				message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=3.0)
				if message and message.get("type") == "message":
					payload = message.get("data")
					if isinstance(payload, bytes):
						payload = payload.decode("utf-8")
					if isinstance(payload, str):
						try:
							payload = json.loads(payload)
						except json.JSONDecodeError:
							payload = {"message": payload}

					try:
						await websocket.send_json(payload)
					except Exception as send_exc:
						# Handle send failures gracefully - likely client disconnected
						exc_name = send_exc.__class__.__name__
						if "ConnectionClosed" in exc_name or "Disconnected" in exc_name:
							logger.info("Client disconnected during send", extra={"grid_id": grid_id})
						else:
							logger.warning(f"Send failed: {send_exc}", extra={"grid_id": grid_id})
						break  # Exit loop, cleanup will handle resource deallocation

				await asyncio.sleep(0.1)  # Reduced sleep for responsiveness

			except asyncio.CancelledError:
				logger.info("WebSocket cancelled", extra={"grid_id": grid_id})
				break
			except Exception as loop_exc:
				logger.error(f"Error in message loop: {loop_exc}", extra={"grid_id": grid_id})
				break

	except WebSocketDisconnect:
		logger.info("WebSocket disconnected", extra={"grid_id": grid_id})
	except Exception as handler_exc:  # noqa: BLE001
		exc_name = handler_exc.__class__.__name__
		if "ConnectionClosed" in exc_name or "Disconnected" in exc_name:
			logger.info("WebSocket connection closed", extra={"grid_id": grid_id, "error": exc_name})
		else:
			logger.error(f"Unexpected error in handler: {handler_exc}", extra={"grid_id": grid_id})
	finally:
		# Cleanup resources - NEVER raise exceptions here
		if pubsub is not None:
			try:
				await pubsub.unsubscribe(channel)
			except Exception as exc:  # noqa: BLE001
				logger.debug("PubSub unsubscribe failed", extra={"grid_id": grid_id, "error": str(exc)})
			try:
				await _close_resource(pubsub)
			except Exception as exc:  # noqa: BLE001
				logger.debug("PubSub close failed", extra={"grid_id": grid_id, "error": str(exc)})

		if redis is not None:
			try:
				await _close_resource(redis)
			except Exception as exc:  # noqa: BLE001
				logger.debug("Redis close failed", extra={"grid_id": grid_id, "error": str(exc)})


@router.websocket("/ws/{grid_id}")
async def track_grievance_ws(
	websocket: WebSocket,
	grid_id: str,
	db: AsyncSession = Depends(get_db_session),
) -> None:
	"""
	WebSocket endpoint for tracking grievances.
	DB session is released after initial validation to prevent connection pool exhaustion.
	"""
	# Validate grievance exists and get ID - then release DB connection
	repo = GrievanceRepository(db)
	try:
		grievance = await repo.get_by_grid_id(grid_id)
	except Exception as exc:
		logger.error(f"DB validation failed: {exc}", extra={"grid_id": grid_id})
		await websocket.accept()
		await websocket.send_json({"error": "Service unavailable"})
		await websocket.close(code=1011)
		return

	if grievance is None:
		await websocket.accept()
		await websocket.send_json({"error": "Grid ID not found"})
		await websocket.close(code=1008)
		return

	# DB connection released here; websocket handler uses Redis only
	grievance_id = str(grievance["id"])
	
	# Now proceed with WebSocket connection (DB dependency can be garbage collected)
	await websocket.accept()
	redis = None
	pubsub = None
	channel = f"grievance:{grievance_id}:updates"

	try:
		redis = get_pubsub_redis_client()
		pubsub = redis.pubsub()
		await pubsub.subscribe(channel)

		try:
			await websocket.send_json(
				{
					"type": "subscription",
					"status": "connected",
					"grid_id": grid_id,
					"channel": channel,
				}
			)
		except Exception as exc:
			logger.warning(f"Failed to send subscription confirmation: {exc}", extra={"grid_id": grid_id})

		# Main message loop - catch all exceptions to prevent crashes
		while True:
			try:
				message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=3.0)
				if message and message.get("type") == "message":
					payload = message.get("data")
					if isinstance(payload, bytes):
						payload = payload.decode("utf-8")
					if isinstance(payload, str):
						try:
							payload = json.loads(payload)
						except json.JSONDecodeError:
							payload = {"message": payload}

					try:
						await websocket.send_json(payload)
					except Exception as send_exc:
						# Handle send failures gracefully - likely client disconnected
						exc_name = send_exc.__class__.__name__
						if "ConnectionClosed" in exc_name or "Disconnected" in exc_name:
							logger.info("Client disconnected during send", extra={"grid_id": grid_id})
						else:
							logger.warning(f"Send failed: {send_exc}", extra={"grid_id": grid_id})
						break  # Exit loop

				await asyncio.sleep(0.1)

			except asyncio.CancelledError:
				logger.info("WebSocket cancelled", extra={"grid_id": grid_id})
				break
			except Exception as loop_exc:
				logger.error(f"Error in message loop: {loop_exc}", extra={"grid_id": grid_id})
				break

	except WebSocketDisconnect:
		logger.info("WebSocket disconnected", extra={"grid_id": grid_id})
	except Exception as handler_exc:  # noqa: BLE001
		exc_name = handler_exc.__class__.__name__
		if "ConnectionClosed" in exc_name or "Disconnected" in exc_name:
			logger.info("WebSocket connection closed", extra={"grid_id": grid_id, "error": exc_name})
		else:
			logger.error(f"Unexpected error: {handler_exc}", extra={"grid_id": grid_id})
	finally:
		# Cleanup resources - NEVER raise exceptions here
		if pubsub is not None:
			try:
				await pubsub.unsubscribe(channel)
			except Exception as exc:  # noqa: BLE001
				logger.debug("PubSub unsubscribe failed", extra={"grid_id": grid_id, "error": str(exc)})
			try:
				await _close_resource(pubsub)
			except Exception as exc:  # noqa: BLE001
				logger.debug("PubSub close failed", extra={"grid_id": grid_id, "error": str(exc)})

		if redis is not None:
			try:
				await _close_resource(redis)
			except Exception as exc:  # noqa: BLE001
				logger.debug("Redis close failed", extra={"grid_id": grid_id, "error": str(exc)})
