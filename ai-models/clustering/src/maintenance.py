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
    logger.warning("scikit-learn not available. Falling back to deterministic heuristic predictor.")

class PredictiveMaintenanceEngine:
    def __init__(self):
        self.model = None
        self._is_trained = False
        if HAS_SKLEARN:
            # In a real scenario, this would load a pretrained joblib/pickle model
            self.model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
            
    def train(self, X: List[List[float]], y: List[float]):
        """Train the model with historical data."""
        if not HAS_SKLEARN:
            return
        self.model.fit(X, y)
        self._is_trained = True
        logger.info("Trained PredictiveMaintenanceEngine")

    def extract_features(self, asset_data: Dict[str, Any]) -> List[float]:
        """Convert asset dictionary to feature vector.
        Expected keys: complaint_count_7d, complaint_count_30d, avg_severity, days_since_last_complaint
        """
        features = [
            float(asset_data.get("complaint_count_7d", 0)),
            float(asset_data.get("complaint_count_30d", 0)),
            float(asset_data.get("avg_severity", 0.5)),
            float(asset_data.get("days_since_last_complaint", 365))
        ]
        return features

    def _heuristic_risk(self, asset_data: Dict[str, Any]) -> Dict[str, Any]:
        c7 = float(asset_data.get("complaint_count_7d", 0))
        c30 = float(asset_data.get("complaint_count_30d", 0))
        sev = float(asset_data.get("avg_severity", 0.5))
        silence_days = float(asset_data.get("days_since_last_complaint", 365))

        recent_pressure = min(1.0, c7 / 20.0)
        trend_pressure = min(1.0, c30 / 60.0)
        severity_pressure = min(1.0, sev)
        recency_pressure = 1.0 - min(1.0, silence_days / 90.0)

        score = (
            0.45 * recent_pressure
            + 0.20 * trend_pressure
            + 0.25 * severity_pressure
            + 0.10 * recency_pressure
        )

        factors: List[str] = []
        if recent_pressure > 0.5:
            factors.append("High recent complaint volume")
        if severity_pressure > 0.6:
            factors.append("Elevated average severity")
        if recency_pressure > 0.7:
            factors.append("Repeated short-interval complaints")

        days_to_fail = max(1, int((1.0 - score) * 14))
        return {
            "failure_probability": round(max(0.0, min(1.0, score)), 3),
            "predicted_failure_date": (datetime.now() + timedelta(days=days_to_fail)).isoformat(),
            "factors": factors,
        }

    def predict_failure(self, asset_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict probability of failure within 7 days."""
        if not HAS_SKLEARN or not self._is_trained:
            return self._heuristic_risk(asset_data)
            
        features = self.extract_features(asset_data)
        X = np.array([features])
        
        # Predict score
        prob = float(self.model.predict(X)[0])
        # Clamp between 0 and 1
        prob = max(0.0, min(1.0, prob))
        
        # Explain prediction via feature importances
        factors = []
        if prob > 0.5:
            importances = self.model.feature_importances_
            feature_names = ["7-day complaints", "30-day complaints", "Avg severity", "Days since last complaint"]
            # Get index of highest importance
            top_idx = np.argmax(importances)
            factors.append(f"Main factor: {feature_names[top_idx]}")
            
        days_to_fail = max(1, int((1.0 - prob) * 14))
        
        return {
            "failure_probability": round(prob, 3),
            "predicted_failure_date": (datetime.now() + timedelta(days=days_to_fail)).isoformat(),
            "factors": factors
        }

maintenance_engine = PredictiveMaintenanceEngine()
