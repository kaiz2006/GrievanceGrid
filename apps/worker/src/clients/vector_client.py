from __future__ import annotations

import logging
from typing import Any

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from src.config import settings

logger = logging.getLogger(__name__)


class VectorClient:
    def __init__(self) -> None:
        self.collection_name = settings.qdrant_collection
        self.embedding_dim = settings.embedding_dimension
        self.client = QdrantClient(url=settings.qdrant_url)

    def ensure_collection(self) -> None:
        existing = self.client.get_collections().collections
        if any(c.name == self.collection_name for c in existing):
            return

        self.client.create_collection(
            collection_name=self.collection_name,
            vectors_config=VectorParams(size=self.embedding_dim, distance=Distance.COSINE),
        )

    def upsert_grievance_embedding(
        self,
        grievance_id: str,
        embedding: list[float],
        payload: dict[str, Any],
    ) -> str:
        self.ensure_collection()

        point_id = grievance_id
        self.client.upsert(
            collection_name=self.collection_name,
            points=[PointStruct(id=point_id, vector=embedding, payload=payload)],
        )

        logger.info("Indexed grievance embedding", extra={"grievance_id": grievance_id})
        return point_id