import { apiRequest, type GraphQLContext } from "./http.js";

type RawCluster = {
  cluster_id: string;
  cluster_type: string;
  centroid_lat: number;
  centroid_lng: number;
  member_count: number;
  crisis_score?: number | null;
  is_active: boolean;
  topics?: string[] | null;
  metadata?: unknown;
};

type RawClusterResponse = {
  count: number;
  clusters: RawCluster[];
};

type RawDashboard = {
  summary?: {
    total_grievances: number;
    resolved: number;
    pending: number;
    escalated: number;
    avg_resolution_hours?: number | null;
  };
  by_category?: Array<{ category: string; count: number; resolved: number }>;
  by_priority?: Array<{ priority: string; count: number; avg_resolution_hours?: number | null }>;
  sla_compliance?: {
    response_sla_met?: number | null;
    resolution_sla_met?: number | null;
  };
  heat_map_data?: Array<{ lat: number; lng: number; intensity: number }>;
  predictive_alerts?: unknown[];
};

function mapCluster(item: RawCluster): Record<string, unknown> {
  return {
    clusterId: item.cluster_id,
    clusterType: item.cluster_type,
    centroidLat: item.centroid_lat,
    centroidLng: item.centroid_lng,
    memberCount: item.member_count,
    crisisScore: item.crisis_score ?? null,
    isActive: item.is_active,
    topics: item.topics ?? null,
    metadata: item.metadata ?? null,
  };
}

export const clusterResolvers = {
  Query: {
    async clusters(
      _: unknown,
      args: { activeOnly?: boolean; clusterType?: string; limit?: number },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>[]> {
      const params = new URLSearchParams();

      if (typeof args.activeOnly === "boolean") params.set("active", String(args.activeOnly));
      if (args.clusterType) params.set("cluster_type", args.clusterType);
      if (typeof args.limit === "number") params.set("limit", String(args.limit));

      const query = params.toString();
      const payload = await apiRequest<RawClusterResponse>(
        `/clusters${query ? `?${query}` : ""}`,
        { method: "GET" },
        ctx
      );

      return payload.clusters.map(mapCluster);
    },

    async dashboard(
      _: unknown,
      args: { from?: string; to?: string },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      const params = new URLSearchParams();
      if (args.from) params.set("from", args.from);
      if (args.to) params.set("to", args.to);

      const query = params.toString();
      const payload = await apiRequest<RawDashboard>(
        `/analytics/dashboard${query ? `?${query}` : ""}`,
        { method: "GET" },
        ctx
      );

      return {
        summary: payload.summary
          ? {
              totalGrievances: payload.summary.total_grievances,
              resolved: payload.summary.resolved,
              pending: payload.summary.pending,
              escalated: payload.summary.escalated,
              avgResolutionHours: payload.summary.avg_resolution_hours ?? null,
            }
          : null,
        byCategory: (payload.by_category ?? []).map((row) => ({
          category: row.category,
          count: row.count,
          resolved: row.resolved,
        })),
        byPriority: (payload.by_priority ?? []).map((row) => ({
          priority: row.priority,
          count: row.count,
          avgResolutionHours: row.avg_resolution_hours ?? null,
        })),
        slaCompliance: payload.sla_compliance
          ? {
              responseSlaMet: payload.sla_compliance.response_sla_met ?? null,
              resolutionSlaMet: payload.sla_compliance.resolution_sla_met ?? null,
            }
          : {
              responseSlaMet: null,
              resolutionSlaMet: null,
            },
        heatMapData: (payload.heat_map_data ?? []).map((point) => ({
          lat: point.lat,
          lng: point.lng,
          intensity: point.intensity,
        })),
        predictiveAlerts: payload.predictive_alerts ?? [],
      };
    },
  },
};
