import asyncio
import httpx
import time
import statistics
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Service URLs
SERVICES = {
    "LLM": "http://localhost:8001",
    "CV": "http://localhost:8002",
    "GNN": "http://localhost:8003"
}

async def benchmark_endpoint(client, name, url, payload, iterations=10):
    latencies = []
    logger.info(f"Benchmarking {name} at {url}...")
    
    for i in range(iterations):
        start_time = time.perf_counter()
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            end_time = time.perf_counter()
            latencies.append((end_time - start_time) * 1000)
        except Exception as e:
            logger.error(f"Error benchmarking {name}: {e}")
            continue
            
    if latencies:
        avg_latency = statistics.mean(latencies)
        p95_latency = statistics.quantiles(latencies, n=20)[18] if len(latencies) >= 20 else max(latencies)
        logger.info(f"{name} Results: Avg={avg_latency:.2f}ms, P95={p95_latency:.2f}ms")
        return {"name": name, "avg": avg_latency, "p95": p95_latency}
    return None

async def run_benchmarks():
    async with httpx.AsyncClient(timeout=10.0) as client:
        # 1. LLM Benchmark
        llm_results = await benchmark_endpoint(
            client, "LLM Classify", f"{SERVICES['LLM']}/classify", 
            {"text": "There is a deep pothole in the middle of the road near the metro station."},
            iterations=20
        )
        
        # 2. CV Benchmark
        cv_results = await benchmark_endpoint(
            client, "CV Severity", f"{SERVICES['CV']}/severity",
            {"image_url": "https://example.com/pothole.jpg"}, # Mock URL
            iterations=20
        )
        
        # 3. GNN Benchmark
        gnn_results = await benchmark_endpoint(
            client, "GNN Routing", f"{SERVICES['GNN']}/route",
            {"category": "ROADS", "priority": "HIGH"},
            iterations=20
        )

if __name__ == "__main__":
    asyncio.run(run_benchmarks())
