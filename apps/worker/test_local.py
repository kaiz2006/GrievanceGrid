#!/usr/bin/env python3
"""
Local development helper for GrievanceGrid Worker.
Tests task dispatching and basic worker functionality.
"""

import asyncio
import json
import os
import sys
from datetime import datetime, timezone

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from config import settings
from clients import BackendClient, LlmClient, CvClient, GnnClient, VectorClient
from tasks import (
    process_grievance_ai,
    process_voice_grievance,
    run_contestation_audit,
    recluster_recent_grievances,
    update_infrastructure_risk_scores,
    send_status_notification,
    publish_tracking_event,
)


def log(msg: str, level: str = "INFO"):
    """Simple logger."""
    timestamp = datetime.now(timezone.utc).isoformat()
    print(f"[{timestamp}] {level}: {msg}")


async def test_clients():
    """Test all client connections."""
    log("Testing ML clients...", "TEST")
    
    llm = LlmClient()
    cv = CvClient()
    gnn = GnnClient()
    vector = VectorClient()
    backend = BackendClient()
    
    # Test LLM client
    log(f"LLM Service URL: {settings.llm_service_url}")
    result = llm.classify("The road has a big pothole")
    log(f"LLM classify result: {result}")
    
    # Test Vector client
    log("Testing Vector client...")
    embedding = [0.1] * settings.embedding_dimension
    vector.upsert_grievance_embedding(
        "test-001",
        embedding,
        {"category": "ROADS", "priority": "HIGH"}
    )
    log("Vector embedding indexed successfully")
    
    # Test Backend client
    log("Testing Backend client...")
    result = backend.post_ai_result("test-001", {
        "ai_category": "ROADS",
        "ai_priority": "HIGH",
        "damage_severity": 0.8
    })
    log(f"Backend sync result: {result}")


async def test_tasks():
    """Test task operations."""
    log("Testing Celery tasks...", "TEST")
    
    # Create test payload
    grievance_id = "GRI-2026-000001"
    test_payload = {
        "raw_input": "There is a huge pothole on Main Street near the market",
        "title": "Pothole on Main Street",
        "description": "A large pothole that's causing accidents",
        "before_photo_url": "https://example.com/photo.jpg",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "hint_category": "ROADS",
        "hint_priority": "HIGH",
        "hint_department": "PUBLIC_WORKS"
    }
    
    log(f"\nProcessing grievance: {grievance_id}", "TEST")
    result_data = process_grievance_ai(grievance_id, test_payload)
    log(f"AI Task Result: {result_data.get('ai_category')}, Anomaly: {result_data.get('is_anomaly')}")
    
    # Test clustering
    log("\nTesting clustering task...", "TEST")
    grievances = [
        {"id": f"test-{i:03d}", "latitude": 13.0+i*0.001, "longitude": 77.5+i*0.001, 
         "description": "Pothole problem on the road"}
        for i in range(6)
    ]
    cluster_result = recluster_recent_grievances(grievances=grievances)
    log(f"Clustering Result: Found {cluster_result.get('clusters_found')} clusters")
    if cluster_result.get('clusters'):
        log(f"First Cluster Topics: {cluster_result['clusters'][0].get('topics')}")
    
    # Test maintenance
    log("\nTesting maintenance risk task...", "TEST")
    test_assets = [{
        "id": "ASSET-001",
        "complaint_count_7d": 15,
        "complaint_count_30d": 45,
        "avg_severity": 0.8,
        "days_since_last_complaint": 2
    }]
    maint_result = update_infrastructure_risk_scores(assets=test_assets)
    log(f"Maintenance Result: {maint_result.get('assets_processed')} assets processed")

    # Test voice
    log("\nTesting voice response...", "TEST")
    voice_result = process_voice_grievance(grievance_id, "https://example.com/audio.mp3")
    log(f"Voice Response Text: {voice_result.get('voice_response_text')}")
    log(f"Voice Audio URL: {voice_result.get('voice_response_audio_url')}")


def main():
    """Main test runner."""
    print("""
    ╔════════════════════════════════════════════════════════╗
    ║     GrievanceGrid Worker - Local Development Test      ║
    ╚════════════════════════════════════════════════════════╝
    """)
    
    log(f"Worker App: {settings.app_name}")
    log(f"Broker URL: {settings.broker_url}")
    log(f"Dry Run Mode: {settings.dry_run}")
    log(f"Embedding Dimension: {settings.embedding_dimension}")
    
    print("\n" + "="*60)
    
    try:
        if not settings.dry_run:
            asyncio.run(test_clients())
            print("\n" + "="*60 + "\n")
        else:
            log("Skipping network client tests (Dry-Run enabled)", "INFO")
            
        asyncio.run(test_tasks())
        
        print("\n" + "="*60)
        log("✅ All tests completed!", "SUCCESS")
        
    except Exception as e:
        log(f"❌ Test failed: {str(e)}", "ERROR")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
