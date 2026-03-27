// SLA Service for GrievanceGrid
// Following API SPEC - SLA Monitoring endpoints
import { apiClient, mockDelay } from "./api.client";

export interface SLABreachItem {
  sla_id: string;
  grievance_id: string;
  grid_id: string;
  sla_type: string;
  deadline_at: string;
  escalation_level: number;
  title: string;
  priority: string;
  status: string;
  location_address: string | null;
  department_id?: string;
  assigned_team?: string;
}

export interface SLABreachResponse {
  count: number;
  items: SLABreachItem[];
}

export interface SLATimer {
  grievance_id: string;
  sla_type: string;
  deadline_at: string;
  is_breached: boolean;
  remaining_hours?: number;
}

export interface SLAStats {
  total_active: number;
  breached: number;
  at_risk: number;
  on_track: number;
  compliance_rate: number;
}

export const slaService = {
  // GET /admin/sla-breaches - Get SLA breaches
  getSLABreaches: async (departmentId?: string, limit: number = 50): Promise<SLABreachResponse> => {
    try {
      const deptParam = departmentId ? `&department=${departmentId}` : "";
      return await apiClient.get(`/admin/sla-breaches?limit=${limit}${deptParam}`);
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock SLA breaches.');
      return {
        count: 4,
        items: [
          {
            sla_id: "sla_001",
            grievance_id: "grievance_101",
            grid_id: "GRI-2026-000101",
            sla_type: "RESOLUTION",
            deadline_at: new Date(Date.now() - 3600000).toISOString(),
            escalation_level: 2,
            title: "Major water pipeline leak",
            priority: "CRITICAL",
            status: "ESCALATED",
            location_address: "Sector 15, Main Road",
            department_id: "dept_water",
            assigned_team: "Team Beta-1"
          },
          {
            sla_id: "sla_002",
            grievance_id: "grievance_102",
            grid_id: "GRI-2026-000102",
            sla_type: "RESPONSE",
            deadline_at: new Date(Date.now() - 7200000).toISOString(),
            escalation_level: 1,
            title: "Power outage in industrial area",
            priority: "HIGH",
            status: "IN_PROGRESS",
            location_address: "Industrial Area, Block B",
            department_id: "dept_electricity",
            assigned_team: "Team Gamma-1"
          }
        ]
      };
    }
  },

  // GET /operations/sla/active - Get active SLA timers
  getActiveSLATimers: async (): Promise<SLATimer[]> => {
    try {
      return await apiClient.get("/operations/sla/active");
    } catch (error) {
      return [
        {
          grievance_id: "grievance_201",
          sla_type: "RESOLUTION",
          deadline_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          is_breached: false,
          remaining_hours: 4
        },
        {
          grievance_id: "grievance_202",
          sla_type: "RESPONSE",
          deadline_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          is_breached: false,
          remaining_hours: 0.5
        }
      ];
    }
  },

  // POST /operations/sla/{grievance_id}/escalate - Escalate grievance
  escalateGrievance: async (grievanceId: string): Promise<{ status: string; grievance_id: string }> => {
    return apiClient.post(`/operations/sla/${grievanceId}/escalate`, {});
  },

  // GET /operations/sla/stats - Get SLA statistics
  getSLAStats: async (): Promise<SLAStats> => {
    try {
      return await apiClient.get("/operations/sla/stats");
    } catch (error) {
      return {
        total_active: 124,
        breached: 8,
        at_risk: 15,
        on_track: 101,
        compliance_rate: 93.5
      };
    }
  },

  // GET /operations/sla/at-risk - Get SLA timers at risk
  getAtRiskSLAs: async (thresholdHours: number = 2): Promise<SLATimer[]> => {
    return apiClient.get(`/operations/sla/at-risk?threshold=${thresholdHours}`, async () => {
      await mockDelay(350);
      
      return [
        {
          grievance_id: "grievance_202",
          sla_type: "RESPONSE",
          deadline_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          is_breached: false,
          remaining_hours: 0.5
        },
        {
          grievance_id: "grievance_205",
          sla_type: "RESOLUTION",
          deadline_at: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
          is_breached: false,
          remaining_hours: 1.5
        }
      ];
    });
  }
};
