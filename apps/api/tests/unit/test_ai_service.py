from __future__ import annotations

import pytest

from src.services.ai_service import AIService


@pytest.mark.asyncio
async def test_classify_grievance_falls_back_when_upstream_unavailable(monkeypatch: pytest.MonkeyPatch) -> None:
    service = AIService(max_retries=1)

    async def fail_request(base_url: str, path: str, payload: dict):
        return None

    monkeypatch.setattr(service, "_request_with_retry", fail_request)

    result = await service.classify_grievance("Pothole near central bus stop")

    assert result["category"] == "OTHER"
    assert result["priority"] == "MEDIUM"
    assert result["source"] == "fallback"


@pytest.mark.asyncio
async def test_enrich_grievance_aggregates_all_ai_outputs(monkeypatch: pytest.MonkeyPatch) -> None:
    service = AIService(max_retries=1)

    async def classify(text: str):
        return {"category": "ROADS", "priority": "HIGH"}

    async def severity(image_url: str):
        return {"severity": 0.8}

    async def route(payload: dict):
        return {"department": "PUBLIC_WORKS"}

    monkeypatch.setattr(service, "classify_grievance", classify)
    monkeypatch.setattr(service, "evaluate_image_severity", severity)
    monkeypatch.setattr(service, "predict_department", route)

    result = await service.enrich_grievance(
        text="Major road damage",
        image_url="https://example.com/road.jpg",
        routing_payload={"lat": 12.97, "lng": 77.59},
    )

    assert result["classification"]["category"] == "ROADS"
    assert result["severity"]["severity"] == 0.8
    assert result["department"]["department"] == "PUBLIC_WORKS"
