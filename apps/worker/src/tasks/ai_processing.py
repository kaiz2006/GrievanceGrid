from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from celery import shared_task

from src.clients import BackendClient, CvClient, GnnClient, LlmClient, VectorClient
from src.config import settings
from src.utils import deterministic_embedding

logger = logging.getLogger(__name__)

llm_client = LlmClient()
cv_client = CvClient()
gnn_client = GnnClient()
vector_client = VectorClient()
backend_client = BackendClient()


def _build_voice_fallback(grievance_id: str, audio_url: str, reason: str) -> dict[str, Any]:
    short_code = grievance_id.replace("-", "")[:8].upper()
    transcript = (
        f"Voice message for grievance {short_code} could not be transcribed reliably. "
        "A text summary fallback has been generated for manual review."
    )
    summary = "Voice grievance received; pending manual transcription review"

    return {
        "transcription": transcript,
        "summary": summary,
        "ai_category": "OTHER",
        "ai_priority": "MEDIUM",
        "fallback_used": True,
        "fallback_reason": reason,
        "ui_payload": {
            "title": "Transcription Pending Review",
            "message": "The audio was received, but automatic transcription confidence was low.",
            "action": "manual_review_required",
            "audio_url": audio_url,
        },
    }


@shared_task(
    bind=True,
    name="src.tasks.ai_processing.process_grievance_ai",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def process_grievance_ai(self, grievance_id: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    """Run AI enrichment for a grievance record.

    The task shape follows backend_todo.md:
    1) LLM category + priority
    2) CV severity if image exists
    3) Vector embedding index
    4) GNN routing suggestion
    """
    payload = payload or {}
    text_input = (
        payload.get("raw_input")
        or payload.get("description")
        or payload.get("title")
        or "No grievance description provided"
    )

    llm_category = payload.get("hint_category", "INFRASTRUCTURE")
    llm_priority = payload.get("hint_priority", "MEDIUM")
    llm_summary = payload.get("description") or ""
    cv_severity = 0.82 if payload.get("before_photo_url") else None
    suggested_department = payload.get("hint_department", "PUBLIC_WORKS")
    vector_source = "fallback"
    callback_synced = False
    similar_cases: list[dict[str, Any]] = []

    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated AI enrichment")

        embedding = deterministic_embedding(text_input, settings.embedding_dimension)
        embedding_indexed = True
    else:
        llm_result = llm_client.classify(text_input) or {}
        llm_category = llm_result.get("category", llm_category) or llm_category
        llm_priority = llm_result.get("priority", llm_priority) or llm_priority
        llm_summary = llm_result.get("summary", llm_summary) or llm_summary
        suggested_department = llm_result.get("department", suggested_department) or suggested_department

        if payload.get("before_photo_url"):
            cv_prediction = cv_client.estimate_severity(str(payload["before_photo_url"]))
            if cv_prediction is not None:
                cv_severity = cv_prediction

        embedding = llm_client.embed(text_input)
        if embedding:
            vector_source = "llm-service"
        else:
            embedding = deterministic_embedding(text_input, settings.embedding_dimension)

        route = gnn_client.predict_route(
            {
                "grievance_id": grievance_id,
                "description": text_input,
                "category": llm_category,
                "priority": llm_priority,
            }
        )
        if route and isinstance(route.get("department"), str):
            suggested_department = route["department"]

        try:
            vector_client.upsert_grievance_embedding(
                grievance_id,
                embedding,
                {
                    "category": llm_category,
                    "priority": llm_priority,
                    "department": suggested_department,
                    "summary": llm_summary,
                },
            )

            # Suggest similar historical cases for downstream resolution support.
            similar_cases = [
                case
                for case in vector_client.find_similar(embedding, category=llm_category, limit=5)
                if case.get("id") != grievance_id
            ]
            embedding_indexed = True
        except Exception as exc:
            logger.warning("Failed to index embedding in Qdrant", extra={"error": str(exc)})
            embedding_indexed = False

    result = {
        "grievance_id": grievance_id,
        "ai_category": llm_category,
        "ai_priority": llm_priority,
        "ai_summary": llm_summary,
        "damage_severity": cv_severity,
        "vector_indexed": embedding_indexed,
        "vector_source": vector_source,
        "embedding_dimension": len(embedding),
        "assigned_department": suggested_department,
        "similar_cases": similar_cases,
        "processed_at": datetime.now(timezone.utc).isoformat(),
    }

    if not settings.dry_run:
        callback_synced = backend_client.post_ai_result(grievance_id, result)
    result["backend_sync"] = callback_synced

    logger.info("Processed grievance AI enrichment", extra={"task": self.name, "result": result})
    return result


@shared_task(
    bind=True,
    name="src.tasks.ai_processing.process_voice_grievance",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def process_voice_grievance(self, grievance_id: str, audio_url: str) -> dict[str, Any]:
    """Process voice grievance pipeline (STT + summarization placeholder)."""
    callback_synced = False
    fallback = _build_voice_fallback(grievance_id, audio_url, reason="dry_run")

    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning deterministic voice fallback payload")
        transcription = fallback["transcription"]
        summary = fallback["summary"]
        ai_category = fallback["ai_category"]
        ai_priority = fallback["ai_priority"]
        fallback_used = True
        fallback_reason = fallback["fallback_reason"]
        ui_payload = fallback["ui_payload"]
    else:
        stt_result = llm_client.transcribe(audio_url) or {}
        transcription = str(stt_result.get("transcription") or "").strip()
        summary = str(stt_result.get("summary") or "").strip()
        fallback_used = False
        fallback_reason = None
        ui_payload = None

        if not transcription:
            fallback = _build_voice_fallback(grievance_id, audio_url, reason="stt_unavailable")
            transcription = fallback["transcription"]
            summary = fallback["summary"]
            ai_category = fallback["ai_category"]
            ai_priority = fallback["ai_priority"]
            fallback_used = True
            fallback_reason = fallback["fallback_reason"]
            ui_payload = fallback["ui_payload"]
        else:
            if not summary:
                summary = transcription[:280]

            extracted = llm_client.classify(transcription) if transcription else None
            ai_category = (extracted or {}).get("category") or "OTHER"
            ai_priority = (extracted or {}).get("priority") or "MEDIUM"

    result = {
        "grievance_id": grievance_id,
        "audio_url": audio_url,
        "transcription": transcription,
        "summary": summary,
        "ai_category": ai_category,
        "ai_priority": ai_priority,
        "fallback_used": fallback_used,
        "fallback_reason": fallback_reason,
        "ui_payload": ui_payload,
        "processed_at": datetime.now(timezone.utc).isoformat(),
    }

    if not settings.dry_run:
        callback_synced = backend_client.post_voice_result(grievance_id, result)
    result["backend_sync"] = callback_synced

    logger.info("Processed voice grievance", extra={"task": self.name, "result": result})
    return result


@shared_task(
    bind=True,
    name="src.tasks.ai_processing.run_contestation_audit",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def run_contestation_audit(
    self,
    grievance_id: str,
    reason: str,
    evidence_photo: str | None = None,
    audit_id: str | None = None,
) -> dict[str, Any]:
    """Run a lightweight AI audit workflow for contested grievances."""
    audit_id = audit_id or f"audit_{grievance_id[:8]}"

    if settings.dry_run:
        logger.info("WORKER_DRY_RUN enabled, returning simulated contest audit")
        risk_score = 0.5
        recommendation = "Manual officer review required"
        evidence_severity = None
    else:
        classification = llm_client.classify(reason) or {}
        recommendation = classification.get("summary") or "Manual officer review required"
        risk_score = 0.7 if classification.get("priority") == "HIGH" else 0.45
        evidence_severity = cv_client.estimate_severity(evidence_photo) if evidence_photo else None

    result = {
        "audit_id": audit_id,
        "grievance_id": grievance_id,
        "reason": reason,
        "evidence_photo": evidence_photo,
        "risk_score": risk_score,
        "evidence_severity": evidence_severity,
        "recommendation": recommendation,
        "status": "AUDIT_QUEUED",
        "processed_at": datetime.now(timezone.utc).isoformat(),
    }

    logger.info("Processed grievance contest audit", extra={"task": self.name, "result": result})
    return result
