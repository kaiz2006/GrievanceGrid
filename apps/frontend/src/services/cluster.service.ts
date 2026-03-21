// Cluster Service for GrievanceGrid
// Following API SPEC Section 7 - Geospatial Clusters
import { apiClient, mockDelay } from "./api.client";

export interface ClusterItem {
  cluster_id: string;
  cluster_type: string;
  centroid_lat: number;
  centroid_lng: number;
  member_count: number;
  crisis_score: number | null;
  is_active: boolean;
  topics: string[] | null;
  metadata: Record<string, any> | null;
  radius_meters?: number;
  recommended_action?: string;
}

export interface ClusterListResponse {
  count: number;
  clusters: ClusterItem[];
}

export interface ReclusterResponse {
  task_id: string;
  scheduled_at: string;
}

export const clusterService = {
  // GET /clusters - Get all clusters
  getClusters: async (params?: { type?: string; active?: boolean; limit?: number }): Promise<ClusterListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.active !== undefined) queryParams.append('active', String(params.active));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    
    return apiClient.get(`/clusters?${queryParams.toString()}`, async () => {
      await mockDelay(400);
      
      return {
        count: 3,
        clusters: [
          {
            cluster_id: "cluster_001",
            cluster_type: "DBSCAN_GEO",
            centroid_lat: 28.6150,
            centroid_lng: 77.2100,
            member_count: 23,
            crisis_score: 0.85,
            is_active: true,
            topics: ["water_leak", "drainage", "road_damage"],
            metadata: { radius_meters: 500, avg_severity: 0.72 },
            radius_meters: 500,
            recommended_action: "URGENT: Infrastructure inspection needed"
          },
          {
            cluster_id: "cluster_002",
            cluster_type: "DBSCAN_GEO",
            centroid_lat: 28.6320,
            centroid_lng: 77.2180,
            member_count: 15,
            crisis_score: 0.62,
            is_active: true,
            topics: ["power_outage", "transformer"],
            metadata: { radius_meters: 350, avg_severity: 0.58 },
            radius_meters: 350,
            recommended_action: "Schedule maintenance check"
          },
          {
            cluster_id: "cluster_003",
            cluster_type: "DBSCAN_GEO",
            centroid_lat: 28.6010,
            centroid_lng: 77.1950,
            member_count: 8,
            crisis_score: 0.41,
            is_active: true,
            topics: ["garbage", "sanitation"],
            metadata: { radius_meters: 200, avg_severity: 0.35 },
            radius_meters: 200,
            recommended_action: "Routine cleanup scheduled"
          }
        ]
      };
    });
  },

  // GET /clusters/{cluster_id} - Get single cluster details
  getCluster: async (clusterId: string): Promise<ClusterItem> => {
    return apiClient.get(`/clusters/${clusterId}`, async () => {
      await mockDelay(300);
      return {
        cluster_id: clusterId,
        cluster_type: "DBSCAN_GEO",
        centroid_lat: 28.6150,
        centroid_lng: 77.2100,
        member_count: 23,
        crisis_score: 0.85,
        is_active: true,
        topics: ["water_leak", "drainage", "road_damage"],
        metadata: { radius_meters: 500, avg_severity: 0.72 },
        radius_meters: 500,
        recommended_action: "URGENT: Infrastructure inspection needed"
      };
    });
  },

  // POST /clusters/recluster - Trigger recluster
  triggerRecluster: async (): Promise<ReclusterResponse> => {
    return apiClient.post("/clusters/recluster", {}, async () => {
      await mockDelay(300);
      
      return {
        task_id: `task_${Date.now()}`,
        scheduled_at: new Date().toISOString()
      };
    });
  },

  // GET /clusters/{cluster_id}/grievances - Get grievances in cluster
  getClusterGrievances: async (clusterId: string, limit: number = 50) => {
    return apiClient.get(`/clusters/${clusterId}/grievances?limit=${limit}`, async () => {
      await mockDelay(350);
      return {
        count: 3,
        items: [
          {
            id: "grievance_001",
            grid_id: "GRI-2026-000101",
            title: "Water leak on main street",
            category: "WATER_SUPPLY",
            priority: "HIGH",
            status: "IN_PROGRESS",
            location: { lat: 28.6152, lng: 77.2102 }
          },
          {
            id: "grievance_002",
            grid_id: "GRI-2026-000102",
            title: "Drainage overflow",
            category: "SANITATION",
            priority: "MEDIUM",
            status: "PENDING",
            location: { lat: 28.6148, lng: 77.2098 }
          },
          {
            id: "grievance_003",
            grid_id: "GRI-2026-000103",
            title: "Road damage near junction",
            category: "ROADS",
            priority: "HIGH",
            status: "ROUTED",
            location: { lat: 28.6155, lng: 77.2105 }
          }
        ]
      };
    });
  }
};
