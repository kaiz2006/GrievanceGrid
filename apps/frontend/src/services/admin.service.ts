// Mock Admin Service for GrievanceGrid
// Following API SPEC Sections 7, 8
export const adminService = {
  getDashboard: async () => {
    console.log(`[API CALL]: GET /analytics/dashboard`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      summary: {
        total_grievances: 1250,
        resolved: 980,
        pending: 180,
        escalated: 45,
        avg_resolution_hours: 28.5
      },
      by_category: [
        { category: "Infrastructure", count: 450, resolved: 380 },
        { category: "Utilities", count: 320, resolved: 290 },
        { category: "Sanitation", count: 200, resolved: 185 },
        { category: "Safety", count: 180, resolved: 125 }
      ],
      sla_compliance: {
        response_sla_met: 94.5,
        resolution_sla_met: 87.2
      },
      heat_map_data: [
        { lat: 28.61, lng: 77.20, intensity: 0.8 },
        { lat: 28.62, lng: 77.21, intensity: 0.6 }
      ],
      predictive_alerts: [
        { id: "alt_1", type: "Transformer", asset_id: "T-1234", failure_probability: 0.78, message: "⚠️ Transformer T-1234: 78% failure risk" },
        { id: "alt_2", type: "Water Main", asset_id: "W-55", failure_probability: 0.85, message: "⚠️ Water main near Sector 15: Likely leak" }
      ]
    };
  },

  getClusters: async () => {
    console.log(`[API CALL]: GET /clusters?type=DBSCAN&active=true`);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      clusters: [
        {
          cluster_id: "cluster_001",
          location: { lat: 28.6150, lng: 77.2100 },
          grievance_count: 23,
          crisis_score: 0.85,
          topics: ["water_leak", "drainage"]
        }
      ]
    };
  }
};
