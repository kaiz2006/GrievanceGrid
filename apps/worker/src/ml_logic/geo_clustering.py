import numpy as np
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

try:
    from sklearn.cluster import DBSCAN
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

class GeoClusteringService:
    def __init__(self, eps_meters=500.0, min_samples=5):
        self.eps_meters = eps_meters
        self.min_samples = min_samples
        self.earth_radius = 6371000.0
        self.eps_radians = eps_meters / self.earth_radius

    def detect_clusters(self, grievances: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not grievances: return []
        
        valid_points = [g for g in grievances if 'latitude' in g and 'longitude' in g]
        if len(valid_points) < self.min_samples: return []
        
        coords = np.array([[np.radians(float(g['latitude'])), np.radians(float(g['longitude']))] for g in valid_points])

        if HAS_SKLEARN:
            db = DBSCAN(eps=self.eps_radians, min_samples=self.min_samples, metric='haversine').fit(coords)
            labels = db.labels_
        else:
            # Fallback naive binning
            labels = [int(hash(f"{round(g['latitude'], 3)}-{round(g['longitude'], 3)}") % 100) for g in valid_points]

        clusters = {}
        for idx, label in enumerate(labels):
            if label == -1: continue
            if label not in clusters:
                clusters[label] = {"id": int(label), "points": [], "lats": [], "lngs": []}
            clusters[label]["points"].append(valid_points[idx].get("id"))
            clusters[label]["lats"].append(valid_points[idx]["latitude"])
            clusters[label]["lngs"].append(valid_points[idx]["longitude"])

        results = []
        for c in clusters.values():
            results.append({
                "cluster_id": c["id"],
                "centroid": {"lat": sum(c["lats"])/len(c["lats"]), "lng": sum(c["lngs"])/len(c["lngs"])},
                "point_count": len(c["points"]),
                "grievance_ids": c["points"]
            })
        return results

geo_clustering = GeoClusteringService()
