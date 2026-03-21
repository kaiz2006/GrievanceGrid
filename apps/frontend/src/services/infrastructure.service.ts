// Infrastructure Service for GrievanceGrid
// Following API SPEC Sections 9, 10 - Predictive Maintenance
import { apiClient, mockDelay } from "./api.client";

export interface InfrastructureAsset {
  id: string;
  asset_type: string;
  asset_name: string;
  complaint_count_7d: number;
  complaint_count_30d: number;
  unresolved_count: number;
  failure_risk_score?: number;
  predicted_failure_date?: string;
  department_id?: string;
  location?: { lat: number; lng: number };
  last_maintenance?: string;
  risk_factors?: string[];
}

export interface RiskUpdatePayload {
  asset_id: string;
  failure_risk_score: number;
  predicted_failure_date?: string;
  risk_factors?: string[];
}

export const infrastructureService = {
  // GET /analytics/infrastructure/assets - Get all assets
  getAssets: async (highRiskOnly: boolean = false): Promise<InfrastructureAsset[]> => {
    return apiClient.get(`/analytics/infrastructure/assets?high_risk=${highRiskOnly}`, async () => {
      await mockDelay(400);
      
      const assets: InfrastructureAsset[] = [
        {
          id: "asset_001",
          asset_type: "TRANSFORMER",
          asset_name: "T-1234 (Sector 15)",
          complaint_count_7d: 8,
          complaint_count_30d: 24,
          unresolved_count: 3,
          failure_risk_score: 0.87,
          predicted_failure_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          department_id: "dept_electricity",
          location: { lat: 28.615, lng: 77.210 },
          last_maintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          risk_factors: ["overheating", "age > 15 years"]
        },
        {
          id: "asset_002",
          asset_type: "WATER_MAIN",
          asset_name: "WM-55 (Main Avenue)",
          complaint_count_7d: 12,
          complaint_count_30d: 35,
          unresolved_count: 7,
          failure_risk_score: 0.78,
          predicted_failure_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          department_id: "dept_water",
          location: { lat: 28.620, lng: 77.215 },
          last_maintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          risk_factors: ["corrosion", "frequent leaks"]
        },
        {
          id: "asset_003",
          asset_type: "STREET_LIGHT",
          asset_name: "SL-200 Block",
          complaint_count_7d: 5,
          complaint_count_30d: 18,
          unresolved_count: 2,
          failure_risk_score: 0.45,
          department_id: "dept_pwd",
          location: { lat: 28.610, lng: 77.205 },
          last_maintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          risk_factors: []
        },
        {
          id: "asset_004",
          asset_type: "ROAD_SECTION",
          asset_name: "NH-48 Junction",
          complaint_count_7d: 15,
          complaint_count_30d: 42,
          unresolved_count: 11,
          failure_risk_score: 0.92,
          predicted_failure_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          department_id: "dept_pwd",
          location: { lat: 28.625, lng: 77.220 },
          last_maintenance: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          risk_factors: ["potholes", "heavy traffic", "structural damage"]
        },
        {
          id: "asset_005",
          asset_type: "DRAINAGE",
          asset_name: "DR-12 (Industrial Area)",
          complaint_count_7d: 6,
          complaint_count_30d: 19,
          unresolved_count: 4,
          failure_risk_score: 0.56,
          department_id: "dept_sanitation",
          location: { lat: 28.630, lng: 77.225 },
          last_maintenance: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          risk_factors: ["blockage risk"]
        }
      ];
      
      if (highRiskOnly) {
        return assets.filter(a => (a.failure_risk_score || 0) >= 0.7);
      }
      return assets;
    });
  },

  // GET /analytics/infrastructure/assets/{id} - Get single asset
  getAsset: async (assetId: string): Promise<InfrastructureAsset> => {
    return apiClient.get(`/analytics/infrastructure/assets/${assetId}`, async () => {
      await mockDelay(300);
      return {
        id: assetId,
        asset_type: "TRANSFORMER",
        asset_name: "T-1234 (Sector 15)",
        complaint_count_7d: 8,
        complaint_count_30d: 24,
        unresolved_count: 3,
        failure_risk_score: 0.87,
        predicted_failure_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        department_id: "dept_electricity",
        location: { lat: 28.615, lng: 77.210 },
        last_maintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        risk_factors: ["overheating", "age > 15 years"]
      };
    });
  },

  // POST /analytics/infrastructure/risk-update - Update risk scores (internal)
  updateRiskScores: async (updates: RiskUpdatePayload[]): Promise<{ updated_count: number; timestamp: string }> => {
    return apiClient.post("/analytics/infrastructure/risk-update", { updates }, async () => {
      await mockDelay(300);
      
      return {
        updated_count: updates.length,
        timestamp: new Date().toISOString()
      };
    });
  },

  // GET /analytics/dashboard (predictive_alerts) - Get predictive alerts
  getPredictiveAlerts: async (): Promise<InfrastructureAsset[]> => {
    return apiClient.get("/analytics/dashboard?alerts_only=true", async () => {
      await mockDelay(350);
      
      return [
        {
          id: "alert_001",
          asset_type: "TRANSFORMER",
          asset_name: "T-1234",
          complaint_count_7d: 8,
          complaint_count_30d: 24,
          unresolved_count: 3,
          failure_risk_score: 0.87,
          predicted_failure_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          department_id: "dept_electricity"
        },
        {
          id: "alert_002",
          asset_type: "ROAD_SECTION",
          asset_name: "NH-48 Junction",
          complaint_count_7d: 15,
          complaint_count_30d: 42,
          unresolved_count: 11,
          failure_risk_score: 0.92,
          predicted_failure_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          department_id: "dept_pwd"
        }
      ];
    });
  },

  // POST /analytics/infrastructure/maintenance - Schedule maintenance
  scheduleMaintenance: async (assetId: string, scheduledDate: string, notes?: string) => {
    return apiClient.post("/analytics/infrastructure/maintenance", { asset_id: assetId, scheduled_date: scheduledDate, notes }, async () => {
      await mockDelay(400);
      return {
        maintenance_id: `maint_${Date.now()}`,
        asset_id: assetId,
        scheduled_date: scheduledDate,
        status: "SCHEDULED",
        message: "Maintenance scheduled successfully"
      };
    });
  }
};
