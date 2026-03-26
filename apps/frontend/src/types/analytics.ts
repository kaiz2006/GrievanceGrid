export interface SummaryBlock {
  total_grievances: number;
  resolved: number;
  pending: number;
  escalated: number;
  avg_resolution_hours: number | null;
}

export interface CategoryMetric {
  category: string;
  count: number;
  resolved: number;
}

export interface PriorityMetric {
  priority: string;
  count: number;
  avg_resolution_hours: number | null;
}

export interface SLACompliance {
  response_sla_met: number | null;
  resolution_sla_met: number | null;
}

export interface HeatMapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export interface InfrastructureAlert {
  asset_id: string;
  department_id: string;
  asset_type: string;
  asset_name: string;
  risk_score: number;
  complaint_count_7d: number;
  complaint_count_30d: number;
  unresolved_count: number;
  predicted_failure_date: string | null;
}

export interface DashboardAnalytics {
  summary: SummaryBlock;
  by_category: CategoryMetric[];
  by_priority: PriorityMetric[];
  sla_compliance: SLACompliance;
  heat_map_data: HeatMapPoint[];
  predictive_alerts: InfrastructureAlert[];
}
