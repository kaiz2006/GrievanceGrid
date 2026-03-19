from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.core.worker import dispatch_task
from src.repositories.grievances import GrievanceRepository

router = APIRouter()

ALLOWED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".m4a", ".ogg"}


class VoiceProcessResponse(BaseModel):
	grievance_id: str
	grid_id: str
	processing_task_id: str
	file_name: str
	received_at: str
	status: str


class VoiceResultRequest(BaseModel):
	model_config = ConfigDict(extra="allow")

	grievance_id: str | None = None
	audio_url: str | None = None
	transcription: str | None = None
	summary: str | None = None
	ai_category: str | None = None
	ai_priority: str | None = None
	processed_at: str | None = None


class VoiceResultResponse(BaseModel):
	grievance_id: str
	status: str
	updated_at: str


def _build_grid_id() -> str:
	year = datetime.now(timezone.utc).year
	suffix = uuid4().hex[:6].upper()
	return f"GRI-{year}-{suffix}"


@router.post("/process", response_model=VoiceProcessResponse)
async def process_voice(
	file: UploadFile = File(...),
	db: AsyncSession = Depends(get_db_session),
) -> VoiceProcessResponse:
	file_name = file.filename or ""
	lower_name = file_name.lower()
	if not any(lower_name.endswith(ext) for ext in ALLOWED_AUDIO_EXTENSIONS):
		raise HTTPException(
			status_code=400,
			detail="Unsupported audio format. Allowed: .wav, .mp3, .m4a, .ogg",
		)

	repo = GrievanceRepository(db)
	grievance_id = str(uuid4())
	grid_id = _build_grid_id()
	received_at = datetime.now(timezone.utc).isoformat()

	task_id = dispatch_task(
		"src.tasks.ai_processing.process_voice_grievance",
		grievance_id,
		file_name,
	)

	try:
		await repo.create(
			{
				"id": grievance_id,
				"grid_id": grid_id,
				"title": "Voice Grievance Submission",
				"description": f"Voice grievance uploaded: {file_name}",
				"category": "OTHER",
				"priority": "MEDIUM",
				"voice_recorded": True,
				"voice_url": file_name,
			}
		)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail=str(exc)) from exc

	return VoiceProcessResponse(
		grievance_id=grievance_id,
		grid_id=grid_id,
		processing_task_id=task_id,
		file_name=file_name,
		received_at=received_at,
		status="CREATED",
	)


@router.post("/{grievance_id}/result", response_model=VoiceResultResponse)
async def receive_voice_result(
	grievance_id: str,
	payload: VoiceResultRequest,
	db: AsyncSession = Depends(get_db_session),
) -> VoiceResultResponse:
	repo = GrievanceRepository(db)
	updated = await repo.update_voice_result(grievance_id, payload.model_dump())
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return VoiceResultResponse(
		grievance_id=grievance_id,
		status=updated["status"],
		updated_at=str(updated.get("updated_at") or datetime.now(timezone.utc).isoformat()),
	)
