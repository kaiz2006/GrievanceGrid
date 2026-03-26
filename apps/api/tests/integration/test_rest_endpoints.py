from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest


def test_health_endpoint(client) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_create_grievance_dispatches_ai_task(client, monkeypatch: pytest.MonkeyPatch) -> None:
    now = datetime.now(timezone.utc)

    async def fake_create(self, grievance_payload: dict):
        return {
            "id": grievance_payload["id"],
            "grid_id": grievance_payload["grid_id"],
            "status": "CREATED",
            "created_at": now,
            "response_deadline": now + timedelta(hours=24),
            "resolution_deadline": now + timedelta(hours=72),
        }

    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.create", fake_create)
    monkeypatch.setattr("src.api.v1.grievances.dispatch_task", lambda *args, **kwargs: "task-101")

    response = client.post(
        "/api/v1/grievances",
        json={
            "title": "Major pothole near bus stand",
            "description": "Road damage causing traffic risk",
            "category": "ROADS",
            "priority": "HIGH",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "location_address": "MG Road, Bengaluru",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["processing_task_id"] == "task-101"
    assert body["status"] == "CREATED"
    assert body["grid_id"].startswith("GRI-")


def test_list_grievances_returns_filtered_rows(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_list_grievances(self, **kwargs):
        return [
            {
                "id": "g-1",
                "grid_id": "GRI-2026-AB12CD",
                "status": "ASSIGNED",
                "title": "Streetlight not working",
                "category": "ELECTRICITY",
                "priority": "MEDIUM",
                "created_at": datetime.now(timezone.utc),
            }
        ]

    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.list_grievances", fake_list_grievances)

    response = client.get("/api/v1/grievances?status=ASSIGNED")

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 1
    assert body["items"][0]["status"] == "ASSIGNED"


def test_get_grievance_details_returns_timeline(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_get_by_id(self, grievance_id: str):
        return {
            "id": grievance_id,
            "grid_id": "GRI-2026-DETAIL1",
            "status": "IN_PROGRESS",
            "category": "ROADS",
            "priority": "HIGH",
            "title": "Damaged divider",
            "description": "Median is broken and unsafe",
            "citizen_id": "citizen-1",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }

    async def fake_timeline(self, grievance_id: str):
        return [{"status": "CREATED", "timestamp": datetime.now(timezone.utc), "description": "Created"}]

    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.get_by_id", fake_get_by_id)
    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.get_timeline", fake_timeline)

    grievance_id = "d0e4b843-0678-44f2-97ea-5eeef7f3462e"
    response = client.get(f"/api/v1/grievances/{grievance_id}")

    assert response.status_code == 200
    body = response.json()
    assert body["grievance_id"] == grievance_id
    assert body["timeline"][0]["status"] == "CREATED"


def test_update_grievance_status_endpoint(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_update_status(self, grievance_id: str, new_status: str, notes: str | None = None):
        return {"grievance_id": grievance_id, "status": new_status, "updated_at": datetime.now(timezone.utc)}

    monkeypatch.setattr("src.services.grievance_service.GrievanceService.update_status", fake_update_status)

    grievance_id = "4740ce06-cada-44f2-97ea-5eeef7f3462e"
    response = client.patch(
        f"/api/v1/grievances/{grievance_id}/status",
        json={"status": "IN_PROGRESS", "notes": "Team started work"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["grievance_id"] == grievance_id
    assert body["status"] == "IN_PROGRESS"


def test_submit_feedback_endpoint(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_add_feedback(
        self,
        grievance_id: str,
        rating: int,
        comment: str | None = None,
        is_satisfied: bool | None = None,
    ):
        return {"grievance_id": grievance_id, "rating": rating, "updated_at": datetime.now(timezone.utc)}

    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.add_feedback", fake_add_feedback)

    grievance_id = "bd90f43e-fd19-44f2-97ea-5eeef7f3462e"
    response = client.post(
        f"/api/v1/grievances/{grievance_id}/feedback",
        json={"rating": 5, "comment": "Resolved quickly", "is_satisfied": True},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["grievance_id"] == grievance_id
    assert body["rating"] == 5


def test_contest_endpoint_triggers_audit(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_mark_contested(
        self,
        grievance_id: str,
        reason: str,
        evidence_photo: str | None = None,
        audit_id: str | None = None,
        audit_task_id: str | None = None,
    ):
        return {"id": grievance_id, "status": "CONTESTED", "audit_id": audit_id or "audit-1", "audit_task_id": audit_task_id or "task-1"}

    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.mark_contested", fake_mark_contested)
    monkeypatch.setattr("src.api.v1.grievances.dispatch_task", lambda *args, **kwargs: "audit-task-1")

    grievance_id = "4a426440-ea59-44f2-97ea-5eeef7f3462e"
    response = client.post(
        f"/api/v1/grievances/{grievance_id}/contest",
        json={"reason": "Issue is unresolved", "evidence_photo": "https://example.com/proof.jpg"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "CONTESTED"
    assert body["audit_triggered"] is True
    assert body["audit_task_id"] == "audit-task-1"


def test_tracking_endpoint_returns_sla_and_eta(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_get_by_grid_id(self, grid_id: str):
        return {
            "id": "g-track-1",
            "grid_id": grid_id,
            "status": "ASSIGNED",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "assigned_team_id": "team-1",
        }

    async def fake_get_timeline(self, grievance_id: str):
        return [
            {
                "status": "ASSIGNED",
                "timestamp": datetime.now(timezone.utc),
                "description": "Assigned to operations team",
            }
        ]

    async def fake_get_by_grievance(self, grievance_id: str):
        return [
            {
                "sla_type": "RESPONSE",
                "deadline_at": datetime.now(timezone.utc) + timedelta(hours=2),
                "is_breached": False,
            }
        ]

    class RedisStub:
        async def get(self, key: str):
            return '{"latitude": 12.9720, "longitude": 77.5950, "updated_at": "2026-01-01T00:00:00Z"}'

        async def hgetall(self, key: str):
            return {}

    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.get_by_grid_id", fake_get_by_grid_id)
    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.get_timeline", fake_get_timeline)
    monkeypatch.setattr("src.repositories.slas.SLARepository.get_by_grievance", fake_get_by_grievance)
    monkeypatch.setattr("src.api.v1.tracking.get_redis_client", lambda: RedisStub())

    response = client.get("/api/v1/track/GRI-2026-TRACK01")

    assert response.status_code == 200
    body = response.json()
    assert body["current_status"] == "ASSIGNED"
    assert body["current_sla_type"] == "RESPONSE"
    assert body["assigned_team_location"]["latitude"] == 12.972
    assert body["predicted_eta_minutes"] >= 1


def test_clusters_endpoint_returns_cluster_rows(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_list_clusters(self, cluster_type=None, is_active=True, limit=50):
        return [
            {
                "id": "cluster-1",
                "cluster_type": "POTHOLE",
                "centroid_lat": 12.9716,
                "centroid_lng": 77.5946,
                "member_count": 12,
                "crisis_score": 0.89,
                "is_active": True,
                "topics": ["roads", "safety"],
                "metadata": {"ward": "Ward-21"},
            }
        ]

    monkeypatch.setattr("src.repositories.operations.ClusterRepository.list_clusters", fake_list_clusters)

    response = client.get("/api/v1/clusters")

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 1
    assert body["clusters"][0]["cluster_type"] == "POTHOLE"


def test_recluster_endpoint_dispatches_background_task(client, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("src.api.v1.clusters.dispatch_task", lambda *args, **kwargs: "cluster-task-1")

    response = client.post("/api/v1/clusters/recluster")

    assert response.status_code == 200
    body = response.json()
    assert body["task_id"] == "cluster-task-1"


def test_analytics_dashboard_endpoint_maps_payload(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_dashboard_payload(self, from_date=None, to_date=None):
        return {
            "summary": {
                "total_grievances": 100,
                "resolved": 70,
                "pending": 20,
                "escalated": 10,
                "avg_resolution_hours": 18.5,
            },
            "by_category": [{"category": "ROADS", "count": 50, "resolved": 40}],
            "by_priority": [{"priority": "HIGH", "count": 30, "avg_resolution_hours": 12.0}],
            "sla_compliance": {"response_sla_met": 92.5, "resolution_sla_met": 86.0},
            "heat_map_data": [{"lat": 12.97, "lng": 77.59, "intensity": 0.8}],
            "predictive_alerts": [
                {
                    "id": "asset-1",
                    "department_id": "dept-1",
                    "asset_type": "DRAIN",
                    "asset_name": "Drain Segment A",
                    "failure_risk_score": 0.91,
                    "complaint_count_7d": 5,
                    "complaint_count_30d": 13,
                    "unresolved_count": 2,
                    "predicted_failure_date": datetime.now(timezone.utc),
                }
            ],
        }

    monkeypatch.setattr(
        "src.services.analytics_service.AnalyticsService.get_dashboard_payload",
        fake_dashboard_payload,
    )

    response = client.get("/api/v1/analytics/dashboard")

    assert response.status_code == 200
    body = response.json()
    assert body["summary"]["total_grievances"] == 100
    assert body["sla_compliance"]["response_sla_met"] == 92.5
    assert body["predictive_alerts"][0]["asset_id"] == "asset-1"


def test_admin_sla_breaches_endpoint_returns_items(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_get_breached_slas(self, department_id=None, limit=100):
        return [
            {
                "id": "sla-1",
                "grievance_id": "g-1",
                "grid_id": "GRI-2026-111111",
                "sla_type": "RESPONSE",
                "deadline_at": datetime.now(timezone.utc),
                "escalation_level": 2,
                "title": "Waterlogging in lane",
                "priority": "HIGH",
                "status": "ESCALATED",
                "location_address": "12th Main",
            }
        ]

    monkeypatch.setattr("src.repositories.slas.SLARepository.get_breached_slas", fake_get_breached_slas)

    response = client.get("/api/v1/admin/sla-breaches")

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 1
    assert body["items"][0]["escalation_level"] == 2


def test_admin_escalations_endpoint_merges_statuses(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_list_grievances(self, status: str | None = None, **kwargs):
        if status == "ESCALATED":
            return [
                {
                    "id": "g-esc-1",
                    "grid_id": "GRI-2026-E1",
                    "title": "Escalated case",
                    "status": "ESCALATED",
                    "priority": "HIGH",
                    "assigned_department_id": "dept-1",
                    "created_at": datetime.now(timezone.utc),
                }
            ]
        return [
            {
                "id": "g-con-1",
                "grid_id": "GRI-2026-C1",
                "title": "Contested case",
                "status": "CONTESTED",
                "priority": "MEDIUM",
                "assigned_department_id": "dept-2",
                "created_at": datetime.now(timezone.utc),
            }
        ]

    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.list_grievances", fake_list_grievances)

    response = client.get("/api/v1/admin/escalations")

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 2


def test_admin_audit_endpoint_returns_history(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_history(self, grievance_id: str):
        return [
            {
                "id": "audit-1",
                "event_type": "STATUS_CHANGED",
                "old_status": "ASSIGNED",
                "new_status": "IN_PROGRESS",
                "description": "Work started",
                "actor_name": "Officer A",
                "created_at": datetime.now(timezone.utc),
            }
        ]

    monkeypatch.setattr("src.repositories.operations.AuditLogRepository.get_grievance_history", fake_history)

    response = client.get("/api/v1/admin/grievances/g-5/audit")

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 1
    assert body["events"][0]["event_type"] == "STATUS_CHANGED"


def test_admin_assign_department_endpoint(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_assign_department(self, grievance_id: str, department_id: str):
        return {"id": grievance_id, "status": "ASSIGNED", "assigned_department_id": department_id}

    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.assign_department", fake_assign_department)

    response = client.patch(
        "/api/v1/admin/grievances/g-6/assign-department",
        json={"department_id": "dept-9"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["department_id"] == "dept-9"


def test_voice_process_endpoint_accepts_audio_upload(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_save_upload(self, file, subdir: str):
        return "https://cdn.example.com/voice/clip.mp3"

    async def fake_create(self, grievance_payload: dict):
        return {"id": grievance_payload["id"], "grid_id": grievance_payload["grid_id"], "status": "CREATED"}

    monkeypatch.setattr("src.services.storage_service.StorageService.save_upload", fake_save_upload)
    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.create", fake_create)
    monkeypatch.setattr("src.api.v1.voice.dispatch_task", lambda *args, **kwargs: "voice-task-1")

    response = client.post(
        "/api/v1/voice/process",
        files={"file": ("sample.mp3", b"audio-bytes", "audio/mpeg")},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["processing_task_id"] == "voice-task-1"
    assert body["audio_url"] == "https://cdn.example.com/voice/clip.mp3"


def test_voice_result_endpoint_updates_grievance(client, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_update_voice_result(self, grievance_id: str, payload: dict):
        return {"id": grievance_id, "status": "PENDING_ASSIGNMENT", "updated_at": datetime.now(timezone.utc)}

    monkeypatch.setattr("src.repositories.grievances.GrievanceRepository.update_voice_result", fake_update_voice_result)

    response = client.post(
        "/api/v1/voice/g-voice-1/result",
        json={"transcription": "Road blocked by debris", "ai_category": "ROADS", "ai_priority": "HIGH"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["grievance_id"] == "g-voice-1"
    assert body["status"] == "PENDING_ASSIGNMENT"
