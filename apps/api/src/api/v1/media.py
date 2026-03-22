from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile
from pydantic import BaseModel

from src.core.dependencies import get_current_user
from src.services.storage_service import StorageService

router = APIRouter()


class UploadResponse(BaseModel):
	url: str
	filename: str
	content_type: str


@router.post("/upload", response_model=UploadResponse)
async def upload_media(
	file: UploadFile = File(...),
	current_user: dict = Depends(get_current_user),
) -> UploadResponse:
	"""
	Upload an image or audio file for a grievance.
	Returns the public URL for inclusion in the grievance submission.
	"""
	storage = StorageService()
	
	# Determine subdir based on content type
	subdir = "images"
	if file.content_type and "audio" in file.content_type:
		subdir = "voice"
		
	url = await storage.save_upload(file, subdir=subdir)
	
	return UploadResponse(
		url=url,
		filename=file.filename or "unknown",
		content_type=file.content_type or "application/octet-stream",
	)
