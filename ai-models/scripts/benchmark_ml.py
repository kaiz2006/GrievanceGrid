from __future__ import annotations

import asyncio
import json
import logging
import os
import statistics
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable

import httpx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Service URLs
SERVICES = {
    "LLM": os.getenv("LLM_API_URL", "http://localhost:8001"),
    "CV": os.getenv("CV_API_URL", "http://localhost:8002"),
    "GNN": os.getenv("GNN_API_URL", "http://localhost:8003"),
}


@dataclass
class BenchmarkTarget:
    name: str
    url: str
    payload: dict[str, Any]
    max_p95_ms: float
    min_quality_rate: float
    validate: Callable[[dict[str, Any]], bool]


def _is_valid_classify(payload: dict[str, Any]) -> bool:
    data = payload.get("data", {})
    required = {"category", "priority", "summary", "department"}
    if not required.issubset(set(data.keys())):
        return False
    return str(data["category"]).strip() != ""


def _is_valid_severity(payload: dict[str, Any]) -> bool:
    if "severity" not in payload:
        return False
    try:
        value = float(payload["severity"])
    except (TypeError, ValueError):
        return False
    return 0.0 <= value <= 1.0


def _is_valid_route(payload: dict[str, Any]) -> bool:
    if "department" not in payload or "top_departments" not in payload:
        return False
    top = payload["top_departments"]
    if not isinstance(top, list) or not top:
        return False
    return payload["department"] in top


async def benchmark_endpoint(
    client: httpx.AsyncClient,
    target: BenchmarkTarget,
    iterations: int,
) -> dict[str, Any]:
    latencies: list[float] = []
    success_count = 0
    quality_count = 0

    logger.info("Benchmarking %s at %s", target.name, target.url)
    for _ in range(iterations):
        start_time = time.perf_counter()
        try:
            response = await client.post(target.url, json=target.payload)
            duration_ms = (time.perf_counter() - start_time) * 1000
            latencies.append(duration_ms)
            response.raise_for_status()
            success_count += 1

            payload = response.json()
            if target.validate(payload):
                quality_count += 1
        except Exception as exc:
            logger.error("Error benchmarking %s: %s", target.name, exc)

    if not latencies:
        return {
            "name": target.name,
            "status": "failed",
            "reason": "no successful requests",
            "avg_ms": None,
            "p95_ms": None,
            "success_rate": 0.0,
            "quality_rate": 0.0,
        }

    avg_latency = statistics.mean(latencies)
    p95_latency = statistics.quantiles(latencies, n=20)[18] if len(latencies) >= 20 else max(latencies)
    success_rate = success_count / iterations
    quality_rate = quality_count / max(success_count, 1)

    checks = {
        "p95": p95_latency <= target.max_p95_ms,
        "success_rate": success_rate >= 0.95,
        "quality_rate": quality_rate >= target.min_quality_rate,
    }
    status = "passed" if all(checks.values()) else "failed"

    return {
        "name": target.name,
        "status": status,
        "avg_ms": round(avg_latency, 2),
        "p95_ms": round(p95_latency, 2),
        "success_rate": round(success_rate, 3),
        "quality_rate": round(quality_rate, 3),
        "targets": {
            "max_p95_ms": target.max_p95_ms,
            "min_quality_rate": target.min_quality_rate,
            "min_success_rate": 0.95,
        },
        "checks": checks,
    }


async def run_benchmarks() -> int:
    iterations = int(os.getenv("BENCHMARK_ITERATIONS", "20"))
    report_path = Path(os.getenv("BENCHMARK_REPORT_PATH", "ai-models/benchmark-report.json"))

    targets = [
        BenchmarkTarget(
            name="LLM /classify",
            url=f"{SERVICES['LLM']}/classify",
            payload={"text": "There is a deep pothole in the middle of the road near the metro station."},
            max_p95_ms=100.0,
            min_quality_rate=0.90,
            validate=_is_valid_classify,
        ),
        BenchmarkTarget(
            name="CV /severity",
            url=f"{SERVICES['CV']}/severity",
            payload={"image_url": "https://example.com/pothole.jpg"},
            max_p95_ms=200.0,
            min_quality_rate=0.85,
            validate=_is_valid_severity,
        ),
        BenchmarkTarget(
            name="GNN /route",
            url=f"{SERVICES['GNN']}/route",
            payload={"category": "ROADS", "priority": "HIGH"},
            max_p95_ms=30.0,
            min_quality_rate=0.80,
            validate=_is_valid_route,
        ),
    ]

    async with httpx.AsyncClient(timeout=10.0) as client:
        results = [await benchmark_endpoint(client, target, iterations=iterations) for target in targets]

    report = {
        "iterations": iterations,
        "results": results,
        "overall_status": "passed" if all(r["status"] == "passed" for r in results) else "failed",
    }

    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    for result in results:
        logger.info(
            "%s: %s | avg=%sms p95=%sms success=%s quality=%s",
            result["name"],
            result["status"],
            result["avg_ms"],
            result["p95_ms"],
            result["success_rate"],
            result["quality_rate"],
        )

    logger.info("Benchmark report written to %s", report_path)
    return 0 if report["overall_status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(run_benchmarks()))
