import { apiClient } from "./api.client";
import { DashboardAnalytics } from "@/types/analytics";

export const analyticsService = {
  /**
   * GET /analytics/dashboard - Fetch system-wide analytics
   */
  getDashboard: async (from?: string, to?: string): Promise<DashboardAnalytics> => {
    let url = "/analytics/dashboard";
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return apiClient.get<DashboardAnalytics>(url);
  },

  /**
   * GET /analytics/infrastructure/assets - List all infrastructure assets
   */
  getInfrastructureAssets: async () => {
    return apiClient.get("/analytics/infrastructure/assets");
  }
};
