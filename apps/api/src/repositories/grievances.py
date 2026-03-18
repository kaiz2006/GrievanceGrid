from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from threading import RLock
from typing import Any


class InMemoryGrievanceRepository:
    def __init__(self) -> None:
        self._records: dict[str, dict[str, Any]] = {}
        self._grid_index: dict[str, str] = {}
        self._lock = RLock()

    def create(self, grievance: dict[str, Any]) -> dict[str, Any]:
        grievance_id = str(grievance["grievance_id"])
        grid_id = str(grievance["grid_id"])
        with self._lock:
            self._records[grievance_id] = deepcopy(grievance)
            self._grid_index[grid_id] = grievance_id
            return deepcopy(self._records[grievance_id])

    def list_grievances(
        self,
        *,
        status: str | None = None,
        category: str | None = None,
        priority: str | None = None,
        department: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[dict[str, Any]]:
        with self._lock:
            grievances = list(self._records.values())

        def _matches(grievance: dict[str, Any]) -> bool:
            ai_result = grievance.get("ai_result") or {}
            grievance_category = ai_result.get("ai_category") or grievance.get("hint_category")
            grievance_priority = ai_result.get("ai_priority") or grievance.get("hint_priority")
            grievance_department = ai_result.get("assigned_department") or grievance.get("hint_department")

            if status and grievance.get("status") != status:
                return False
            if category and grievance_category != category:
                return False
            if priority and grievance_priority != priority:
                return False
            if department and grievance_department != department:
                return False
            return True

        filtered = [deepcopy(grievance) for grievance in grievances if _matches(grievance)]
        filtered.sort(key=lambda item: str(item.get("submitted_at", "")), reverse=True)
        return filtered[offset : offset + limit]

    def get_by_id(self, grievance_id: str) -> dict[str, Any] | None:
        with self._lock:
            grievance = self._records.get(grievance_id)
            return deepcopy(grievance) if grievance else None

    def get_by_grid_id(self, grid_id: str) -> dict[str, Any] | None:
        with self._lock:
            grievance_id = self._grid_index.get(grid_id)
            if not grievance_id:
                return None
            grievance = self._records.get(grievance_id)
            return deepcopy(grievance) if grievance else None

    def update_ai_result(self, grievance_id: str, ai_result: dict[str, Any]) -> dict[str, Any] | None:
        with self._lock:
            grievance = self._records.get(grievance_id)
            if grievance is None:
                return None

            processed_at = str(ai_result.get("processed_at") or datetime.now(timezone.utc).isoformat())
            grievance["ai_result"] = deepcopy(ai_result)
            grievance["status"] = "AI_PROCESSED"

            self._append_timeline_entry(
                grievance,
                status="AI_PROCESSED",
                timestamp=processed_at,
                description=(
                    f"AI categorized as {ai_result.get('ai_category', 'UNKNOWN')}, "
                    f"Priority: {ai_result.get('ai_priority', 'UNKNOWN')}"
                ),
            )

            return deepcopy(grievance)

    def update_voice_result(self, grievance_id: str, voice_result: dict[str, Any]) -> dict[str, Any] | None:
        with self._lock:
            grievance = self._records.get(grievance_id)
            if grievance is None:
                return None

            processed_at = str(voice_result.get("processed_at") or datetime.now(timezone.utc).isoformat())
            grievance["voice_result"] = deepcopy(voice_result)
            grievance["status"] = "AI_PROCESSED"

            # Mirror key voice-derived fields into ai_result so filters and details stay uniform.
            grievance["ai_result"] = {
                **(grievance.get("ai_result") or {}),
                "ai_category": voice_result.get("ai_category"),
                "ai_priority": voice_result.get("ai_priority"),
                "ai_summary": voice_result.get("summary"),
                "processed_at": processed_at,
            }

            self._append_timeline_entry(
                grievance,
                status="VOICE_PROCESSED",
                timestamp=processed_at,
                description="Voice grievance processed and enriched",
            )

            return deepcopy(grievance)

    def update_status(self, grievance_id: str, status: str, notes: str | None = None) -> dict[str, Any] | None:
        with self._lock:
            grievance = self._records.get(grievance_id)
            if grievance is None:
                return None

            timestamp = datetime.now(timezone.utc).isoformat()
            grievance["status"] = status
            self._append_timeline_entry(
                grievance,
                status=status,
                timestamp=timestamp,
                description=notes or f"Status updated to {status}",
            )

            return deepcopy(grievance)

    def add_feedback(
        self,
        grievance_id: str,
        *,
        rating: int,
        comment: str | None,
        is_satisfied: bool | None,
    ) -> dict[str, Any] | None:
        with self._lock:
            grievance = self._records.get(grievance_id)
            if grievance is None:
                return None

            submitted_at = datetime.now(timezone.utc).isoformat()
            feedback = {
                "rating": rating,
                "comment": comment,
                "is_satisfied": is_satisfied,
                "submitted_at": submitted_at,
            }

            entries = grievance.setdefault("feedback_entries", [])
            entries.append(feedback)
            grievance["latest_feedback"] = feedback

            self._append_timeline_entry(
                grievance,
                status="FEEDBACK_RECEIVED",
                timestamp=submitted_at,
                description=f"Citizen feedback submitted with rating {rating}/5",
            )

            return deepcopy(grievance)

    def mark_contested(
        self,
        grievance_id: str,
        *,
        reason: str,
        evidence_photo: str | None,
        audit_id: str,
        audit_task_id: str,
    ) -> dict[str, Any] | None:
        with self._lock:
            grievance = self._records.get(grievance_id)
            if grievance is None:
                return None

            contested_at = datetime.now(timezone.utc).isoformat()
            grievance["status"] = "CONTESTED"
            grievance["contest"] = {
                "reason": reason,
                "evidence_photo": evidence_photo,
                "audit_id": audit_id,
                "audit_task_id": audit_task_id,
                "contested_at": contested_at,
            }

            self._append_timeline_entry(
                grievance,
                status="CONTESTED",
                timestamp=contested_at,
                description="Citizen contested resolution and AI audit was triggered",
            )

            return deepcopy(grievance)

    @staticmethod
    def _append_timeline_entry(grievance: dict[str, Any], status: str, timestamp: str, description: str) -> None:
        timeline = grievance.setdefault("timeline", [])
        timeline.append(
            {
                "status": status,
                "timestamp": timestamp,
                "description": description,
            }
        )


grievance_repository = InMemoryGrievanceRepository()
