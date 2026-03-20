from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[2]


def _load_service_module(service: str, module_name: str, purge_modules: list[str]):
    for module in purge_modules:
        sys.modules.pop(module, None)

    src_dir = ROOT / "ai-models" / service / "src"
    if str(src_dir) not in sys.path:
        sys.path.insert(0, str(src_dir))

    spec = importlib.util.spec_from_file_location(module_name, src_dir / "server.py")
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load server module for service: {service}")

    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    return module


def test_llm_classify_contract(monkeypatch):
    module = _load_service_module(
        "llm",
        "llm_server_contract",
        ["server", "processor", "voice_processor", "client", "config"],
    )

    monkeypatch.setattr(
        module.processor,
        "process_unstructured_text",
        lambda text: {
            "category": "ROADS",
            "priority": "HIGH",
            "summary": text[:50],
            "department": "PWD",
        },
    )

    client = TestClient(module.app)
    response = client.post("/classify", json={"text": "There is a deep pothole near station"})

    assert response.status_code == 200
    payload = response.json()
    assert "data" in payload
    assert set(["category", "priority", "summary", "department"]).issubset(payload["data"].keys())


def test_llm_embeddings_contract(monkeypatch):
    module = _load_service_module(
        "llm",
        "llm_server_embeddings_contract",
        ["server", "processor", "voice_processor", "client", "config"],
    )

    monkeypatch.setattr(module.processor, "generate_embedding", lambda _text: [0.1, 0.2, 0.3])

    client = TestClient(module.app)
    response = client.post("/embeddings", json={"input": "water leakage complaint"})

    assert response.status_code == 200
    payload = response.json()
    assert "embedding" in payload
    assert isinstance(payload["embedding"], list)


def test_llm_transcribe_contract(monkeypatch):
    module = _load_service_module(
        "llm",
        "llm_server_transcribe_contract",
        ["server", "processor", "voice_processor", "client", "config"],
    )

    monkeypatch.setattr(
        module.voice_processor,
        "transcribe",
        lambda _path: {
            "transcription": "Road is blocked by debris",
            "summary": "Voice grievance captured",
            "response_message": "Your grievance has been received.",
            "tts_audio_path": None,
        },
    )

    client = TestClient(module.app)
    response = client.post(
        "/transcribe",
        files={"file": ("sample.wav", b"RIFF....", "audio/wav")},
    )

    assert response.status_code == 200
    payload = response.json()
    assert set(["transcription", "summary", "response_message"]).issubset(payload.keys())


def test_cv_severity_contract(monkeypatch):
    module = _load_service_module("cv", "cv_server_contract", ["server", "inference"])

    monkeypatch.setattr(module.estimator, "estimate_severity", lambda _path: 0.73)

    client = TestClient(module.app)
    response = client.post("/severity", json={"image_url": "https://example.com/damage.jpg"})

    assert response.status_code == 200
    payload = response.json()
    assert "severity" in payload
    assert isinstance(payload["severity"], float)


def test_gnn_route_contract(monkeypatch):
    module = _load_service_module(
        "gnn",
        "gnn_server_contract",
        ["server", "inference", "data_loader", "model"],
    )

    monkeypatch.setattr(
        module.router,
        "predict_route",
        lambda _payload: ("PWD", ["PWD", "TRANSPORT", "SANITATION"]),
    )

    client = TestClient(module.app)
    response = client.post("/route", json={"category": "ROADS", "priority": "HIGH"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["department"] == "PWD"
    assert payload["top_departments"] == ["PWD", "TRANSPORT", "SANITATION"]
