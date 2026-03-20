import numpy as np
import logging
import math
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

try:
    from sklearn.cluster import DBSCAN
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False
    logger.warning("scikit-learn not available. Falling back to deterministic clustering implementation.")

class GeoClusteringService:
    def __init__(self, eps_meters=500.0, min_samples=5):
        self.eps_meters = eps_meters
        self.min_samples = min_samples
        # Earth radius in meters
        self.earth_radius = 6371000.0
        # Convert eps to radians for haversine
        self.eps_radians = eps_meters / self.earth_radius

    def _distance_meters(self, a: tuple[float, float], b: tuple[float, float]) -> float:
        lat1, lng1 = a
        lat2, lng2 = b
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        d_phi = math.radians(lat2 - lat1)
        d_lng = math.radians(lng2 - lng1)
        h = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lng / 2) ** 2
        return 2 * self.earth_radius * math.atan2(math.sqrt(h), math.sqrt(max(1e-12, 1 - h)))

    def _neighbors(self, points: list[tuple[float, float]], idx: int) -> list[int]:
        out: list[int] = []
        for j, candidate in enumerate(points):
            if self._distance_meters(points[idx], candidate) <= self.eps_meters:
                out.append(j)
        return out

    def _fallback_cluster_labels(self, points: list[tuple[float, float]]) -> list[int]:
        # Lightweight DBSCAN-style expansion for environments without sklearn.
        labels = [-1] * len(points)
        visited = [False] * len(points)
        cluster_id = 0

        for idx in range(len(points)):
            if visited[idx]:
                continue
            visited[idx] = True
            neighbors = self._neighbors(points, idx)
            if len(neighbors) < self.min_samples:
                continue

            labels[idx] = cluster_id
            queue = list(neighbors)
            while queue:
                current = queue.pop(0)
                if not visited[current]:
                    visited[current] = True
                    current_neighbors = self._neighbors(points, current)
                    if len(current_neighbors) >= self.min_samples:
                        for candidate in current_neighbors:
                            if candidate not in queue:
                                queue.append(candidate)
                if labels[current] == -1:
                    labels[current] = cluster_id

            cluster_id += 1

        return labels
        
    def detect_clusters(self, grievances: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Run DBSCAN on a list of grievances.
        Each grievance must have 'lat' and 'lng' float keys.
        """
        if not grievances:
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

        if HAS_SKLEARN:
            db = DBSCAN(eps=self.eps_radians, min_samples=self.min_samples, metric='haversine').fit(coords)
            labels = list(db.labels_)
        else:
            labels = self._fallback_cluster_labels([(point["lat"], point["lng"]) for point in valid_points])
        
        clusters_found = {}
        for idx, label in enumerate(labels):
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
