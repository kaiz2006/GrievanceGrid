import logging
import numpy as np
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

try:
    from sklearn.ensemble import IsolationForest
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False
    logger.warning("scikit-learn not available. Falling back to deterministic anomaly detector.")

class AnomalyDetector:
    def __init__(self, contamination=0.05):
        """
        contamination: The proportion of outliers in the data set. 
        Adjust based on expected volume of highly anomalous, un-clustered severe grievances.
        """
        self.contamination = contamination
        if HAS_SKLEARN:
            self.model = IsolationForest(contamination=self.contamination, random_state=42)
            
    def detect_anomalies(self, grievances: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Find isolated, high-severity grievances that do not fit local cluster patterns.
        Expected grievance keys: id, lat, lng, priority
        """
        priority_map = {"MINOR": 0, "LOW": 1, "MODERATE": 2, "HIGH": 3, "CRITICAL": 4}
        
        valid_grievances = []
        features = []
        for g in grievances:
            if 'lat' in g and 'lng' in g:
                valid_grievances.append(g)
                sev = priority_map.get(str(g.get("priority", "")).upper(), 2)
                # Feature vector: [Lat, Lng, SeverityScore]
                # We weight severity heavily so distant critical issues get flagged
                features.append([float(g['lat']), float(g['lng']), float(sev) * 10.0])
                
        if not features:
            return []
            
        X = np.array(features)

        if not HAS_SKLEARN:
            if len(X) < 5:
                return []

            means = X.mean(axis=0)
            stds = np.maximum(X.std(axis=0), 1e-6)
            z = np.abs((X - means) / stds)
            # Heavier weight on severity dimension (index 2).
            risk = z[:, 0] * 0.3 + z[:, 1] * 0.3 + z[:, 2] * 0.8
            threshold = np.quantile(risk, max(0.5, 1.0 - self.contamination))

            anomalies: list[dict[str, Any]] = []
            for idx, score in enumerate(risk):
                if score < threshold:
                    continue
                grievance = valid_grievances[idx]
                anomalies.append(
                    {
                        "grievance_id": grievance.get("id"),
                        "lat": grievance.get("lat"),
                        "lng": grievance.get("lng"),
                        "priority": grievance.get("priority"),
                        "anomaly_score": round(float(score), 4),
                        "reason": "Statistically isolated grievance with elevated severity",
                    }
                )

            anomalies.sort(key=lambda item: item["anomaly_score"], reverse=True)
            return anomalies
        
        # Fit and predict (-1 for outliers, 1 for inliers)
        preds = self.model.fit_predict(X)
        anomaly_scores = self.model.decision_function(X) # Lower is more anomalous
        
        anomalies = []
        for idx, (pred, score) in enumerate(zip(preds, anomaly_scores)):
            if pred == -1:
                g = valid_grievances[idx]
                anomalies.append({
                    "grievance_id": g.get("id"),
                    "lat": g.get("lat"),
                    "lng": g.get("lng"),
                    "priority": g.get("priority"),
                    "anomaly_score": round(float(score), 4),
                    "reason": "Geospatially isolated high-severity incident"
                })
                
        # Sort by most anomalous (lowest score) first
        anomalies.sort(key=lambda x: x["anomaly_score"])
        return anomalies

anomaly_detector = AnomalyDetector()
