from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel, ConfigDict

from src.core.worker import dispatch_task
from src.repositories import grievance_repository

router = APIRouter()


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
async def process_voice(file: UploadFile = File(...)) -> VoiceProcessResponse:
	grievance_id = str(uuid4())
	grid_id = _build_grid_id()
	received_at = datetime.now(timezone.utc).isoformat()

	task_id = dispatch_task(
		"src.tasks.ai_processing.process_voice_grievance",
		grievance_id,
		file.filename,
	)

	grievance_repository.create(
		{
			"grievance_id": grievance_id,
			"grid_id": grid_id,
			"status": "CREATED",
			"submitted_at": received_at,
			"processing_task_id": task_id,
			"title": "Voice Grievance Submission",
			"description": f"Voice grievance uploaded: {file.filename}",
			"location_text": None,
			"before_photo_url": None,
			"hint_category": None,
			"hint_priority": None,
			"hint_department": None,
			"ai_result": None,
			"voice_result": None,
			"timeline": [
				{
					"status": "CREATED",
					"timestamp": received_at,
					"description": "Voice grievance submitted successfully",
				}
			],
		}
	)

	return VoiceProcessResponse(
		grievance_id=grievance_id,
		grid_id=grid_id,
		processing_task_id=task_id,
		file_name=file.filename,
		received_at=received_at,
		status="CREATED",
	)


@router.post("/{grievance_id}/result", response_model=VoiceResultResponse)
async def receive_voice_result(grievance_id: str, payload: VoiceResultRequest) -> VoiceResultResponse:
	updated = grievance_repository.update_voice_result(grievance_id, payload.model_dump())
	if updated is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	return VoiceResultResponse(
		grievance_id=grievance_id,
		status=updated["status"],
		updated_at=datetime.now(timezone.utc).isoformat(),
	)
