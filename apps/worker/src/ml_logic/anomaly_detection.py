import logging
import numpy as np
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

try:
    from sklearn.ensemble import IsolationForest
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

class AnomalyDetector:
    def __init__(self, contamination=0.1):
        self.contamination = contamination
        if HAS_SKLEARN:
            self.model = IsolationForest(contamination=self.contamination, random_state=42)

    def detect(self, grievances: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not grievances: return []
        
        points = []
        for g in grievances:
            if 'latitude' in g and 'longitude' in g:
                sev = {"MINOR": 0, "LOW": 1, "MODERATE": 2, "HIGH": 3, "CRITICAL": 4}.get(str(g.get("ai_priority", "MODERATE")), 2)
                points.append([float(g['latitude']), float(g['longitude']), float(sev) * 5.0])
        
        if len(points) < 5: return []
        X = np.array(points)

        if HAS_SKLEARN:
            preds = self.model.fit_predict(X)
            anomalies = [grievances[i] for i, p in enumerate(preds) if p == -1]
        else:
            anomalies = [] # No fallback for now
            
        return anomalies

anomaly_detector = AnomalyDetector()
