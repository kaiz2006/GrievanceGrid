import logging
from typing import Dict, Any, List
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

try:
    from sklearn.ensemble import RandomForestRegressor
    import numpy as np
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

class PredictiveMaintenanceEngine:
    def __init__(self):
        self.model = None
        self._is_trained = False
        if HAS_SKLEARN:
            # Baseline untrained model
            self.model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
            
    def train(self, X: List[List[float]], y: List[float]):
        if not HAS_SKLEARN: return
        self.model.fit(X, y)
        self._is_trained = True

    def extract_features(self, asset_data: Dict[str, Any]) -> List[float]:
        return [
            float(asset_data.get("complaint_count_7d", 0)),
            float(asset_data.get("complaint_count_30d", 0)),
            float(asset_data.get("avg_severity", 0.5)),
            float(asset_data.get("days_since_last_complaint", 365))
        ]

    def predict_failure(self, asset_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict probability of failure and return metadata."""
        c7 = float(asset_data.get("complaint_count_7d", 0))
        c30 = float(asset_data.get("complaint_count_30d", 0))
        sev = float(asset_data.get("avg_severity", 0.5))
        recency = float(asset_data.get("days_since_last_complaint", 365))

        if not HAS_SKLEARN or not self._is_trained:
            # Fake-free mode: no heuristic fallback
            logger.warning("Predictive maintenance model not trained. Returning 0.0 risk score.")
            prob = 0.0
            factors = ["Model not trained"]
        else:
            features = self.extract_features(asset_data)
            prob = float(self.model.predict(np.array([features]))[0])
            prob = round(max(0.0, min(1.0, prob)), 3)
            factors = ["Model identified risk pattern"] if prob > 0.5 else []

        days_to_fail = max(1, int((1.1 - prob) * 14))
        return {
            "failure_probability": prob,
            "predicted_failure_date": (datetime.now() + timedelta(days=days_to_fail)).isoformat(),
            "factors": factors,
        }

maintenance_engine = PredictiveMaintenanceEngine()
