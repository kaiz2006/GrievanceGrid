from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_db_session
from src.core.worker import dispatch_task
from src.repositories.grievances import GrievanceRepository
from src.services.storage_service import StorageService

router = APIRouter()

ALLOWED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".m4a", ".ogg"}


class VoiceProcessResponse(BaseModel):
	grievance_id: str
	grid_id: str
	processing_task_id: str
	file_name: str
	audio_url: str
	transcription_preview: str
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
	storage = StorageService()
	grievance_id = str(uuid4())
	grid_id = _build_grid_id()
	received_at = datetime.now(timezone.utc).isoformat()
	stored_audio_url = await storage.save_upload(file, subdir="voice")

	task_id = dispatch_task(
		"src.tasks.ai_processing.process_voice_grievance",
		grievance_id,
		stored_audio_url,
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
				"voice_url": stored_audio_url,
			}
		)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail=str(exc)) from exc

	return VoiceProcessResponse(
		grievance_id=grievance_id,
		grid_id=grid_id,
		processing_task_id=task_id,
		file_name=file_name,
		audio_url=stored_audio_url,
		transcription_preview="Audio received. Automatic transcription is in progress.",
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


# =============================================================================
# VOICE LANGUAGES ENDPOINT
# =============================================================================


class LanguageItem(BaseModel):
	code: str
	name: str


class LanguagesResponse(BaseModel):
	count: int
	languages: list[LanguageItem]


SUPPORTED_LANGUAGES = [
	{"code": "en", "name": "English"},
	{"code": "hi", "name": "Hindi"},
	{"code": "bn", "name": "Bengali"},
	{"code": "ta", "name": "Tamil"},
	{"code": "te", "name": "Telugu"},
	{"code": "mr", "name": "Marathi"},
	{"code": "gu", "name": "Gujarati"},
	{"code": "kn", "name": "Kannada"},
	{"code": "ml", "name": "Malayalam"},
	{"code": "pa", "name": "Punjabi"},
]


@router.get("/languages", response_model=LanguagesResponse)
async def get_supported_languages() -> LanguagesResponse:
	"""Get list of supported languages for voice processing."""
	languages = [LanguageItem(code=lang["code"], name=lang["name"]) for lang in SUPPORTED_LANGUAGES]
	return LanguagesResponse(count=len(languages), languages=languages)


# =============================================================================
# TEXT-TO-SPEECH ENDPOINT
# =============================================================================


class TTSRequest(BaseModel):
	text: str = Field(min_length=1, max_length=5000)
	language: str = Field(default="en", min_length=2, max_length=5)


class TTSResponse(BaseModel):
	audio_url: str
	duration_seconds: float
	language: str


@router.post("/tts", response_model=TTSResponse)
async def text_to_speech(
	payload: TTSRequest,
	db: AsyncSession = Depends(get_db_session),
) -> TTSResponse:
	"""Convert text to speech audio."""
	# Check if language is supported
	lang_codes = [lang["code"] for lang in SUPPORTED_LANGUAGES]
	if payload.language not in lang_codes:
		raise HTTPException(
			status_code=400,
			detail=f"Unsupported language: {payload.language}. Supported: {', '.join(lang_codes)}",
		)

	# For hackathon: generate a placeholder audio URL
	# In production, this would call an actual TTS service
	audio_id = uuid4().hex
	audio_url = f"/storage/tts/{audio_id}.mp3"

	# Estimate duration (roughly 150 words per minute for speech)
	word_count = len(payload.text.split())
	duration_seconds = round(word_count / 150 * 60, 1)

	return TTSResponse(
		audio_url=audio_url,
		duration_seconds=duration_seconds,
		language=payload.language,
	)


# =============================================================================
# VOICE RESULT GET ENDPOINT
# =============================================================================


class VoiceProcessingResult(BaseModel):
	grievance_id: str
	grid_id: str
	audio_url: str
	transcription: str | None = None
	summary: str | None = None
	ai_category: str | None = None
	ai_priority: str | None = None
	status: str
	processed_at: str | None = None


@router.get("/result/{grievance_id}", response_model=VoiceProcessingResult)
async def get_voice_result(
	grievance_id: str,
	db: AsyncSession = Depends(get_db_session),
) -> VoiceProcessingResult:
	"""Get the voice processing result for a grievance."""
	repo = GrievanceRepository(db)
	grievance = await repo.get_by_id(grievance_id)

	if grievance is None:
		raise HTTPException(status_code=404, detail="Grievance not found")

	if not grievance.get("voice_recorded"):
		raise HTTPException(
			status_code=400,
			detail="This grievance was not submitted via voice",
		)

	return VoiceProcessingResult(
		grievance_id=str(grievance["id"]),
		grid_id=str(grievance["grid_id"]),
		audio_url=grievance.get("voice_url", ""),
		transcription=grievance.get("voice_transcription"),
		summary=grievance.get("voice_summary"),
		ai_category=grievance.get("ai_category"),
		ai_priority=grievance.get("ai_priority"),
		status=str(grievance["status"]),
		processed_at=grievance.get("voice_processed_at"),
	)
