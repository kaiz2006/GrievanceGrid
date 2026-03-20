import numpy as np
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

try:
    from sklearn.cluster import DBSCAN
    from sklearn.metrics.pairwise import haversine_distances
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False
    logger.warning("scikit-learn not available. Falling back to stub clustering.")

class GeoClusteringService:
    def __init__(self, eps_meters=500.0, min_samples=5):
        self.eps_meters = eps_meters
        self.min_samples = min_samples
        # Earth radius in meters
        self.earth_radius = 6371000.0
        # Convert eps to radians for haversine
        self.eps_radians = eps_meters / self.earth_radius
        
    def detect_clusters(self, grievances: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Run DBSCAN on a list of grievances.
        Each grievance must have 'lat' and 'lng' float keys.
        """
        if not HAS_SKLEARN or not grievances:
            return []

        # Extract coords and convert to radians
        # Make sure to filter out those missing coords
        valid_points = []
        vectors = []
        for g in grievances:
            if 'lat' in g and 'lng' in g:
                valid_points.append(g)
                vectors.append([np.radians(float(g['lat'])), np.radians(float(g['lng']))])
                
        if len(vectors) < self.min_samples:
            return []
            
        coords = np.array(vectors)

        # Run DBSCAN
        db = DBSCAN(eps=self.eps_radians, min_samples=self.min_samples, metric='haversine').fit(coords)
        
        clusters_found = {}
        for idx, label in enumerate(db.labels_):
            if label == -1:
                # Noise point
                continue
                
            if label not in clusters_found:
                clusters_found[label] = {
                    "cluster_id": int(label),
                    "grievance_ids": [],
                    "latitudes": [],
                    "longitudes": [],
                    "severities": []
                }
            
            p = valid_points[idx]
            clusters_found[label]["grievance_ids"].append(p.get("id"))
            clusters_found[label]["latitudes"].append(p["lat"])
            clusters_found[label]["longitudes"].append(p["lng"])
            
            # Record severity for crisis score calculation
            sev = str(p.get("priority", "MODERATE")).upper()
            clusters_found[label]["severities"].append(sev)

        results = []
        for label, data in clusters_found.items():
            # Calculate centroid
            centroid_lat = sum(data["latitudes"]) / len(data["latitudes"])
            centroid_lng = sum(data["longitudes"]) / len(data["longitudes"])
            
            score = self.calculate_crisis_score(data["severities"])
            
            results.append({
                "cluster_id": data["cluster_id"],
                "centroid": {"lat": centroid_lat, "lng": centroid_lng},
                "point_count": len(data["grievance_ids"]),
                "grievance_ids": data["grievance_ids"],
                "crisis_score": score
            })
            
        return results

    def calculate_crisis_score(self, severities: List[str]) -> float:
        """Calculate a severity-weighted crisis score."""
        multiplier_map = {
            "CRITICAL": 1.5,
            "HIGH": 1.2,
            "MODERATE": 1.0,
            "LOW": 0.8,
            "MINOR": 0.5
        }
        
        base_score = float(len(severities))
        weighted_sum = sum(multiplier_map.get(s, 1.0) for s in severities)
        
        # Scale score up linearly based on density and severity
        # Returns a higher crisis score for high density of critical incidents
        return round(weighted_sum, 2)

geo_clustering = GeoClusteringService()
