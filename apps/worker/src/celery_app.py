from __future__ import annotations

from celery import Celery
from celery.schedules import crontab

from src.config import settings

celery_app = Celery(
    settings.app_name,
    broker=settings.broker_url,
    backend=settings.result_backend,
    include=[
        "src.tasks.ai_processing",
        "src.tasks.clustering",
        "src.tasks.maintenance",
        "src.tasks.notifications",
        "src.schedulers.sla_monitor",
        "src.schedulers.report_generator",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone=settings.timezone,
    enable_utc=True,
    worker_hijack_root_logger=False,
    task_routes={
        "src.tasks.ai_processing.*": {"queue": "ai-processing"},
        "src.tasks.notifications.*": {"queue": "notifications"},
        "src.schedulers.sla_monitor.*": {"queue": "sla-monitor"},
        "src.schedulers.report_generator.*": {"queue": "reporting"},
        "src.tasks.clustering.*": {"queue": "analytics"},
        "src.tasks.maintenance.*": {"queue": "maintenance"},
    },
)

celery_app.conf.beat_schedule = {
    "sla-monitor-every-minute": {
        "task": "src.schedulers.sla_monitor.monitor_sla_and_escalate",
        "schedule": 60.0,
    },
    "recluster-recent-grievances": {
        "task": "src.tasks.clustering.recluster_recent_grievances",
        "schedule": 600.0,
    },
    "predictive-maintenance-hourly": {
        "task": "src.tasks.maintenance.update_infrastructure_risk_scores",
        "schedule": crontab(minute=0, hour="*"),
    },
    "daily-report-snapshot": {
        "task": "src.schedulers.report_generator.generate_daily_report_snapshot",
        "schedule": crontab(minute=0, hour=0),
    },
}

app = celery_app
