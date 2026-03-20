from __future__ import annotations

from datetime import datetime, timezone

import pytest

from src.services.analytics_service import AnalyticsService


class GrievanceRepoStub:
    async def get_dashboard_summary(self, from_date=None, to_date=None):
        return {
            "total_grievances": 20,
            "resolved": 12,
            "pending": 6,
            "escalated": 2,
            "avg_resolution_hours": 14.5,
        }

    async def get_counts_by_category(self, from_date=None, to_date=None):
        return [{"category": "ROADS", "count": 10, "resolved": 7}]

    async def get_counts_by_priority(self, from_date=None, to_date=None):
        return [{"priority": "HIGH", "count": 6, "avg_resolution_hours": 9.2}]

    async def get_heat_map_data(self, limit=200):
        return [{"lat": 12.97, "lng": 77.59, "intensity": 0.7}]

    async def get_predictive_alerts(self, risk_threshold=0.75, limit=20):
        return [
            {
                "id": "asset-1",
                "department_id": "dept-1",
                "asset_type": "ROAD_SEGMENT",
                "asset_name": "Segment A",
                "failure_risk_score": 0.9,
                "complaint_count_7d": 4,
                "complaint_count_30d": 11,
                "unresolved_count": 2,
                "predicted_failure_date": datetime.now(timezone.utc),
            }
        ]

    async def fetch_scalar(self, query: str, params: dict | None = None):
        if "AVG(citizen_feedback_rating)" in query:
            return 4.4
        if "created_at >= date_trunc('day'" in query:
            return 5
        if "status = 'CONTESTED'" in query:
            return 1
        return None

    async def insert(self, query: str, params: dict):
        return {"id": params["id"], "metric_date": params["metric_date"], "total_grievances": params["total_grievances"]}


class SLARepoStub:
    async def get_sla_compliance(self):
        return {"response_sla_met": 95.0, "resolution_sla_met": 85.0}


@pytest.mark.asyncio
async def test_get_dashboard_payload_contains_all_sections() -> None:
    service = AnalyticsService(db=None)
    service.grievance_repo = GrievanceRepoStub()
    service.sla_repo = SLARepoStub()

    payload = await service.get_dashboard_payload()

    assert payload["summary"]["total_grievances"] == 20
    assert payload["sla_compliance"]["response_sla_met"] == 95.0
    assert len(payload["predictive_alerts"]) == 1


@pytest.mark.asyncio
async def test_generate_daily_snapshot_persists_computed_metrics() -> None:
    service = AnalyticsService(db=None)
    service.grievance_repo = GrievanceRepoStub()
    service.sla_repo = SLARepoStub()

    result = await service.generate_daily_snapshot(metric_date=datetime.now(timezone.utc))

    assert "snapshot" in result
    assert result["snapshot"]["total_grievances"] == 20
