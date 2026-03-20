from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import settings
from src.core.database import get_db_session
from src.services.analytics_service import AnalyticsService

router = APIRouter()


class SummaryBlock(BaseModel):
	total_grievances: int
	resolved: int
	pending: int
	escalated: int
	avg_resolution_hours: float | None = None


class CategoryMetric(BaseModel):
	category: str
	count: int
	resolved: int


class PriorityMetric(BaseModel):
	priority: str
	count: int
	avg_resolution_hours: float | None = None


class SLACompliance(BaseModel):
	response_sla_met: float | None = None
	resolution_sla_met: float | None = None


class HeatMapPoint(BaseModel):
	lat: float
	lng: float
	intensity: float


class DashboardAnalyticsResponse(BaseModel):
	summary: SummaryBlock
	by_category: list[CategoryMetric]
	by_priority: list[PriorityMetric]
	sla_compliance: SLACompliance
	heat_map_data: list[HeatMapPoint]
	predictive_alerts: list[dict[str, Any]]


class DailySnapshotRequest(BaseModel):
	target_day: str | None = None


class DailySnapshotResponse(BaseModel):
	metric_date: str
	records_written: int
	generated_at: str


@router.get("/dashboard", response_model=DashboardAnalyticsResponse)
async def get_dashboard_analytics(
	from_date: str | None = Query(default=None, alias="from"),
	to_date: str | None = Query(default=None, alias="to"),
	db: AsyncSession = Depends(get_db_session),
) -> DashboardAnalyticsResponse:
	service = AnalyticsService(db)
	payload = await service.get_dashboard_payload(from_date=from_date, to_date=to_date)
	summary = payload["summary"]
	by_category = payload["by_category"]
	by_priority = payload["by_priority"]
	sla_compliance = payload["sla_compliance"]
	heat_map_data = payload["heat_map_data"]
	predictive_alerts = payload["predictive_alerts"]

	return DashboardAnalyticsResponse(
		summary=SummaryBlock(
			total_grievances=int(summary.get("total_grievances") or 0),
			resolved=int(summary.get("resolved") or 0),
			pending=int(summary.get("pending") or 0),
			escalated=int(summary.get("escalated") or 0),
			avg_resolution_hours=float(summary["avg_resolution_hours"]) if summary.get("avg_resolution_hours") is not None else None,
		),
		by_category=[
			CategoryMetric(
				category=str(row["category"]),
				count=int(row.get("count") or 0),
				resolved=int(row.get("resolved") or 0),
			)
			for row in by_category
		],
		by_priority=[
			PriorityMetric(
				priority=str(row["priority"]),
				count=int(row.get("count") or 0),
				avg_resolution_hours=float(row["avg_resolution_hours"]) if row.get("avg_resolution_hours") is not None else None,
			)
			for row in by_priority
		],
		sla_compliance=SLACompliance(
			response_sla_met=float(sla_compliance["response_sla_met"]) if sla_compliance.get("response_sla_met") is not None else None,
			resolution_sla_met=float(sla_compliance["resolution_sla_met"]) if sla_compliance.get("resolution_sla_met") is not None else None,
		),
		heat_map_data=[
			HeatMapPoint(
				lat=float(point["lat"]),
				lng=float(point["lng"]),
				intensity=float(point["intensity"]),
			)
			for point in heat_map_data
		],
		predictive_alerts=[
			{
				"asset_id": str(alert["id"]),
				"department_id": str(alert["department_id"]),
				"asset_type": str(alert["asset_type"]),
				"asset_name": str(alert["asset_name"]),
				"risk_score": float(alert["failure_risk_score"]),
				"complaint_count_7d": int(alert.get("complaint_count_7d") or 0),
				"complaint_count_30d": int(alert.get("complaint_count_30d") or 0),
				"unresolved_count": int(alert.get("unresolved_count") or 0),
				"predicted_failure_date": alert["predicted_failure_date"].isoformat()
				if alert.get("predicted_failure_date") and hasattr(alert.get("predicted_failure_date"), "isoformat")
				else (str(alert.get("predicted_failure_date")) if alert.get("predicted_failure_date") else None),
			}
			for alert in predictive_alerts
		],
	)


@router.post("/snapshot", response_model=DailySnapshotResponse)
async def generate_daily_snapshot(
	payload: DailySnapshotRequest,
	x_internal_token: str | None = Header(default=None, alias="X-Internal-Token"),
	db: AsyncSession = Depends(get_db_session),
) -> DailySnapshotResponse:
	if x_internal_token != settings.internal_worker_token:
		raise HTTPException(status_code=401, detail="Invalid internal worker token")

	target = payload.target_day
	metric_date: datetime | None = None
	if target:
		try:
			if "T" in target:
				parsed = datetime.fromisoformat(target.replace("Z", "+00:00"))
				metric_date = parsed.astimezone(timezone.utc)
			else:
				parsed_date = date.fromisoformat(target)
				metric_date = datetime(
					year=parsed_date.year,
					month=parsed_date.month,
					day=parsed_date.day,
					tzinfo=timezone.utc,
				)
		except ValueError as exc:
			raise HTTPException(status_code=400, detail="target_day must be ISO date or datetime") from exc

	service = AnalyticsService(db)
	snapshot = await service.generate_daily_snapshot(metric_date=metric_date)
	return DailySnapshotResponse(
		metric_date=str(snapshot.get("metric_date") or datetime.now(timezone.utc).isoformat()),
		records_written=1 if snapshot.get("snapshot") else 0,
		generated_at=datetime.now(timezone.utc).isoformat(),
	)
