from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from src.core.config import settings


class StorageService:
    """Persist uploaded files to local object storage for hackathon usage."""

    def __init__(self) -> None:
        self.provider = settings.object_storage_provider.lower()
        self.local_dir = Path(settings.object_storage_local_dir)
        self.public_base = settings.object_storage_public_base_url.rstrip("/")

    async def save_upload(self, file: UploadFile, subdir: str = "voice") -> str:
        # Local provider is the intended durable storage for current hackathon scope.
        if self.provider != "local":
            raise ValueError(f"Unsupported object storage provider: {self.provider}")

        extension = Path(file.filename or "").suffix.lower() or ".bin"
        object_name = f"{uuid4().hex}{extension}"

        target_dir = self.local_dir / subdir
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / object_name

        content = await file.read()
        target_path.write_bytes(content)

        relative = target_path.relative_to(self.local_dir).as_posix()
        return f"{self.public_base}/{relative}"
