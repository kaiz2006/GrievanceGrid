from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel

from src.core.worker import dispatch_task

router = APIRouter()


class VoiceProcessResponse(BaseModel):
	grievance_id: str
	processing_task_id: str
	file_name: str
	received_at: str


@router.post("/process", response_model=VoiceProcessResponse)
async def process_voice(file: UploadFile = File(...)) -> VoiceProcessResponse:
	grievance_id = str(uuid4())

	task_id = dispatch_task(
		"src.tasks.ai_processing.process_voice_grievance",
		grievance_id,
		file.filename,
	)

	return VoiceProcessResponse(
		grievance_id=grievance_id,
		processing_task_id=task_id,
		file_name=file.filename,
		received_at=datetime.now(timezone.utc).isoformat(),
	)
