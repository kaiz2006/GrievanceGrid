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
    if settings.dry_run:
        result_data = process_grievance_ai(grievance_id, test_payload)
        log(f"Direct Task Result: {result_data['ai_category']}, {result_data['ai_priority']}")
    else:
        result = process_grievance_ai.apply_async(
            args=[grievance_id, test_payload],
            queue="ai-processing"
        )
        log(f"Task ID: {result.id}")
    
    # Test clustering
    log("\nTesting clustering task...", "TEST")
    grievances = [
        {"id": f"test-{i:03d}", "latitude": 40.71+i*0.01, "longitude": -74.01+i*0.01}
        for i in range(5)
    ]
    if settings.dry_run:
        recluster_recent_grievances(grievances=grievances)
        log("Clustering logic executed directly")
    else:
        result = recluster_recent_grievances.apply_async(
            kwargs={"grievances": grievances},
            queue="analytics"
        )
        log(f"Clustering task ID: {result.id}")
    
    # Test notifications
    log("\nTesting notification task...", "TEST")
    result = send_status_notification.apply_async(
        args=[grievance_id, "IN_PROGRESS", ["citizen@example.com"]],
        queue="notifications"
    )
    log(f"Notification task ID: {result.id}")
    
    # Test tracking event
    log("\nTesting tracking event...", "TEST")
    result = publish_tracking_event.apply_async(
        args=[
            grievance_id,
            {
                "event_type": "STATUS_CHANGE",
                "old_status": "PENDING",
                "new_status": "IN_PROGRESS",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        ],
        queue="notifications"
    )
    log(f"Tracking event task ID: {result.id}")


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
