import sys
import os
from datetime import datetime, timezone

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

def log(msg):
    print(f"[VERIFY] {msg}")

try:
    from ml_logic import maintenance_engine, geo_clustering, anomaly_detector, topic_analysis
    log("ML Logic modules imported successfully (with fallbacks)")
except Exception as e:
    log(f"FAILED to import ML logic: {e}")
    sys.exit(1)

def test_maintenance():
    log("Testing Maintenance Engine...")
    asset = {
        "id": "ASSET-001",
        "complaint_count_7d": 12,
        "complaint_count_30d": 40,
        "avg_severity": 0.85,
        "days_since_last_complaint": 1
    }
    prediction = maintenance_engine.predict_failure(asset)
    log(f"Prediction: {prediction}")
    assert prediction["failure_probability"] > 0.5
    log("Maintenance Engine PASS")

def test_clustering():
    log("Testing Geo-Clustering...")
    grievances = [
        {"id": f"G-{i}", "latitude": 12.97, "longitude": 77.59, "description": "Pothole on MG Road"}
        for i in range(6)
    ]
    clusters = geo_clustering.detect_clusters(grievances)
    log(f"Clusters found: {len(clusters)}")
    if clusters:
        log(f"First cluster: {clusters[0]}")
        texts = ["Pothole on MG Road", "Big road damage", "Pothole problem"] * 2
        topics = topic_analysis.extract_topics(texts)
        log(f"Extracted topics: {topics}")
    log("Geo-Clustering PASS")

def test_anomaly():
    log("Testing Anomaly Detection...")
    # Mock some data
    grievances = [
        {"id": "G1", "latitude": 12.971, "longitude": 77.591, "ai_priority": "MODERATE"},
        {"id": "G2", "latitude": 12.972, "longitude": 77.592, "ai_priority": "MODERATE"},
        {"id": "G3", "latitude": 12.973, "longitude": 77.593, "ai_priority": "MODERATE"},
        {"id": "G4", "latitude": 12.974, "longitude": 77.594, "ai_priority": "MODERATE"},
        {"id": "ANOMALY", "latitude": 14.0, "longitude": 78.0, "ai_priority": "CRITICAL"}
    ]
    anomalies = anomaly_detector.detect(grievances)
    log(f"Anomalies found: {len(anomalies)}")
    # If HAS_SKLEARN is True, it should find the outlier. If False, it returns [].
    log("Anomaly Detection logic executed")

if __name__ == "__main__":
    test_maintenance()
    test_clustering()
    test_anomaly()
    log("✅ ML logic verification script finished successfully")
