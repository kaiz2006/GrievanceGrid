from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.grievances import GrievanceRepository
from src.repositories.slas import SLARepository


class AnalyticsService:
    """Analytics aggregation and daily snapshot generation."""

    def __init__(self, db: AsyncSession) -> None:
        self.grievance_repo = GrievanceRepository(db)
        self.sla_repo = SLARepository(db)

    async def get_dashboard_payload(
        self,
        from_date: str | None = None,
        to_date: str | None = None,
    ) -> dict[str, Any]:
        summary = await self.grievance_repo.get_dashboard_summary(from_date=from_date, to_date=to_date)
        by_category = await self.grievance_repo.get_counts_by_category(from_date=from_date, to_date=to_date)
        by_priority = await self.grievance_repo.get_counts_by_priority(from_date=from_date, to_date=to_date)
        sla_compliance = await self.sla_repo.get_sla_compliance()
        heat_map_data = await self.grievance_repo.get_heat_map_data(limit=200)
        predictive_alerts = await self.grievance_repo.get_predictive_alerts(risk_threshold=0.75, limit=20)

        return {
            "summary": summary,
            "by_category": by_category,
            "by_priority": by_priority,
            "sla_compliance": sla_compliance,
            "heat_map_data": heat_map_data,
            "predictive_alerts": predictive_alerts,
        }

    async def generate_daily_snapshot(self, metric_date: datetime | None = None) -> dict[str, Any]:
        snapshot_date = metric_date or datetime.now(timezone.utc)
        summary = await self.grievance_repo.get_dashboard_summary()
        categories = await self.grievance_repo.get_counts_by_category()
        sla = await self.sla_repo.get_sla_compliance()

        avg_satisfaction = await self.grievance_repo.fetch_scalar(
            """
            SELECT ROUND(AVG(citizen_feedback_rating)::numeric, 2)
            FROM grievances
            WHERE citizen_feedback_rating IS NOT NULL
            """
        )
        new_grievances = await self.grievance_repo.fetch_scalar(
            """
            SELECT COUNT(*)::int
            FROM grievances
            WHERE created_at >= date_trunc('day', :metric_date::timestamptz)
              AND created_at < date_trunc('day', :metric_date::timestamptz) + INTERVAL '1 day'
            """,
            {"metric_date": snapshot_date},
        )
        contested = await self.grievance_repo.fetch_scalar(
            """
            SELECT COUNT(*)::int
            FROM grievances
            WHERE status = 'CONTESTED'::grievance_status
            """
        )

        category_breakdown = {
            str(item.get("category")): int(item.get("count") or 0)
            for item in categories
        }
        response_rate = float(sla.get("response_sla_met") or 0.0)
        resolution_rate = float(sla.get("resolution_sla_met") or 0.0)
        compliance_ratio = round(((response_rate + resolution_rate) / 2.0) / 100.0, 2)

        row = await self.grievance_repo.insert(
            """
            INSERT INTO daily_metrics (
                id,
                metric_date,
                total_grievances,
                new_grievances,
                resolved_grievances,
                escalated_grievances,
                contested_grievances,
                avg_resolution_time_hours,
                sla_compliance_rate,
                avg_citizen_satisfaction,
                category_breakdown,
                created_at
            ) VALUES (
                :id,
                date_trunc('day', :metric_date::timestamptz),
                :total_grievances,
                :new_grievances,
                :resolved_grievances,
                :escalated_grievances,
                :contested_grievances,
                :avg_resolution_time_hours,
                :sla_compliance_rate,
                :avg_citizen_satisfaction,
                :category_breakdown,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (metric_date) DO UPDATE
            SET
                total_grievances = EXCLUDED.total_grievances,
                new_grievances = EXCLUDED.new_grievances,
                resolved_grievances = EXCLUDED.resolved_grievances,
                escalated_grievances = EXCLUDED.escalated_grievances,
                contested_grievances = EXCLUDED.contested_grievances,
                avg_resolution_time_hours = EXCLUDED.avg_resolution_time_hours,
                sla_compliance_rate = EXCLUDED.sla_compliance_rate,
                avg_citizen_satisfaction = EXCLUDED.avg_citizen_satisfaction,
                category_breakdown = EXCLUDED.category_breakdown
            RETURNING *
            """,
            {
                "id": str(uuid4()),
                "metric_date": snapshot_date,
                "total_grievances": int(summary.get("total_grievances") or 0),
                "new_grievances": int(new_grievances or 0),
                "resolved_grievances": int(summary.get("resolved") or 0),
                "escalated_grievances": int(summary.get("escalated") or 0),
                "contested_grievances": int(contested or 0),
                "avg_resolution_time_hours": summary.get("avg_resolution_hours"),
                "sla_compliance_rate": compliance_ratio,
                "avg_citizen_satisfaction": avg_satisfaction,
                "category_breakdown": category_breakdown,
            },
        )

        return {
            "metric_date": snapshot_date.isoformat(),
            "snapshot": row,
        }
