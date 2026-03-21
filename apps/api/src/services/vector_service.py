"""Vector similarity service using Qdrant for finding similar grievances."""

from __future__ import annotations

import logging
from typing import Any

from qdrant_client import QdrantClient
from qdrant_client.http import models

from src.core.config import settings

logger = logging.getLogger(__name__)

COLLECTION_NAME = "grievances"


class VectorService:
	"""Service for vector similarity operations with Qdrant."""

	def __init__(self) -> None:
		self.client: QdrantClient | None = None
		self._initialized = False

	def _ensure_client(self) -> QdrantClient:
		"""Lazy initialization of Qdrant client."""
		if self.client is None:
			qdrant_url = getattr(settings, "qdrant_url", "http://localhost:6333")
			self.client = QdrantClient(url=qdrant_url)
			self._initialized = True
		return self.client

	async def find_similar(
		self,
		embedding: list[float],
		category: str | None = None,
		limit: int = 5,
		score_threshold: float = 0.7,
	) -> list[dict[str, Any]]:
		"""
		Find similar grievances using vector similarity search.

		Args:
			embedding: The query embedding vector
			category: Optional category filter
			limit: Maximum number of results
			score_threshold: Minimum similarity score (0-1)

		Returns:
			List of similar grievances with scores
		"""
		try:
			client = self._ensure_client()

			# Build filter if category provided
			query_filter = None
			if category:
				query_filter = models.Filter(
					must=[
						models.FieldCondition(
							key="category",
							match=models.MatchValue(value=category),
						)
					]
				)

			# Search for similar vectors
			results = client.search(
				collection_name=COLLECTION_NAME,
				query_vector=embedding,
				query_filter=query_filter,
				limit=limit,
				score_threshold=score_threshold,
			)

			# Format results
			similar = []
			for hit in results:
				payload = hit.payload or {}
				similar.append(
					{
						"id": payload.get("grievance_id"),
						"grid_id": payload.get("grid_id"),
						"title": payload.get("title"),
						"score": hit.score,
						"category": payload.get("category"),
						"department": payload.get("department"),
						"resolution_summary": payload.get("resolution_summary"),
						"resolution_time_hours": payload.get("resolution_time_hours"),
					}
				)

			return similar

		except Exception as e:
			logger.error(f"Vector search failed: {e}")
			return []

	async def upsert_grievance(
		self,
		grievance_id: str,
		embedding: list[float],
		metadata: dict[str, Any],
	) -> bool:
		"""
		Insert or update a grievance vector.

		Args:
			grievance_id: Unique grievance identifier
			embedding: The embedding vector
			metadata: Metadata to store with the vector

		Returns:
			True if successful, False otherwise
		"""
		try:
			client = self._ensure_client()

			client.upsert(
				collection_name=COLLECTION_NAME,
				points=[
					models.PointStruct(
						id=grievance_id,
						vector=embedding,
						payload=metadata,
					)
				],
			)
			return True

		except Exception as e:
			logger.error(f"Vector upsert failed: {e}")
			return False

	async def delete_grievance(self, grievance_id: str) -> bool:
		"""Delete a grievance vector."""
		try:
			client = self._ensure_client()
			client.delete(
				collection_name=COLLECTION_NAME,
				points_selector=models.PointIdsList(
					points=[grievance_id],
				),
			)
			return True
		except Exception as e:
			logger.error(f"Vector delete failed: {e}")
			return False
