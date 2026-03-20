from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from src.services.sla_service import SLAService


class SLARepoStub:
    def __init__(self, rows: list[dict]) -> None:
        self.rows = rows
        self.updated: list[dict] = []

    async def fetch_all(self, query: str) -> list[dict]:
        return self.rows

    async def update_breach_status(
        self,
        sla_id: str,
        is_breached: bool,
        escalation_level: int,
    ) -> dict:
        row = {
            "id": sla_id,
            "is_breached": is_breached,
            "escalation_level": escalation_level,
        }
        self.updated.append(row)
        return row


class GrievanceRepoStub:
    def __init__(self) -> None:
        self.calls: list[dict] = []

    async def update_status(self, grievance_id: str, status: str, notes: str) -> dict:
        call = {"grievance_id": grievance_id, "status": status, "notes": notes}
        self.calls.append(call)
        return call


@pytest.mark.asyncio
async def test_check_and_escalate_marks_breach_and_updates_grievance() -> None:
    service = SLAService(db=None)

    overdue = datetime.now(timezone.utc) - timedelta(minutes=2)
    service.sla_repo = SLARepoStub(
        rows=[
            {
                "id": "sla-1",
                "grievance_id": "g-1",
                "sla_type": "RESPONSE",
                "deadline_at": overdue,
                "is_breached": False,
                "escalation_level": 0,
            }
        ]
    )
    grievance_repo = GrievanceRepoStub()
    service.grievance_repo = grievance_repo

    result = await service.check_and_escalate()

    assert result["checked"] == 1
    assert result["breached_count"] == 1
    assert result["escalated_count"] == 0
    assert service.sla_repo.updated[0]["is_breached"] is True
    assert service.sla_repo.updated[0]["escalation_level"] == 2
    assert grievance_repo.calls[0]["status"] == "ESCALATED"


def test_escalation_threshold_levels() -> None:
    service = SLAService(db=None)

    assert service.escalation_threshold("RESPONSE", 10 * 60) == 2
    assert service.escalation_threshold("RESOLUTION", 45 * 60) == 1
    assert service.escalation_threshold("RESPONSE", -1) == 2
    assert service.escalation_threshold("RESOLUTION", 3 * 60 * 60) == 0
