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
    // ALWAYS return mock data for Demo purposes as requested
    console.log('DEMO MODE: Returning mock SLA breaches.');
    await mockDelay(400);
      return {
        count: 8,
        items: [
          {
            sla_id: "sla_001",
            grievance_id: "grievance_101",
            grid_id: "GRI-2026-000101",
            sla_type: "RESOLUTION",
            deadline_at: new Date(Date.now() - 3600000).toISOString(),
            escalation_level: 3,
            title: "CRITICAL: Major water pipeline leak",
            priority: "CRITICAL",
            status: "ESCALATED",
            location_address: "Sector 15, Main Road, Block C",
            department_id: "dept_water",
            assigned_team: "Rapid Response Alpha"
          },
          {
            sla_id: "sla_002",
            grievance_id: "grievance_102",
            grid_id: "GRI-2026-000102",
            sla_type: "RESPONSE",
            deadline_at: new Date(Date.now() - 7200000).toISOString(),
            escalation_level: 2,
            title: "HIGH: Power outage in industrial sector",
            priority: "HIGH",
            status: "IN_PROGRESS",
            location_address: "Industrial Area, Phase II",
            department_id: "dept_electricity",
            assigned_team: "Grid Maintenance Delta"
          },
          {
            sla_id: "sla_003",
            grievance_id: "grievance_103",
            grid_id: "GRI-2026-000105",
            sla_type: "RESOLUTION",
            deadline_at: new Date(Date.now() - 14400000).toISOString(),
            escalation_level: 4,
            title: "CRITICAL: Hazardous waste spill",
            priority: "CRITICAL",
            status: "ESCALATED",
            location_address: "Chemical Zone, Gateway 4",
            department_id: "dept_environment",
            assigned_team: "Hazmat Team 1"
          },
          {
            sla_id: "sla_004",
            grievance_id: "grievance_104",
            grid_id: "GRI-2026-000109",
            sla_type: "RESOLUTION",
            deadline_at: new Date(Date.now() - 1800000).toISOString(),
            escalation_level: 1,
            title: "MEDIUM: Street light malfunction",
            priority: "MEDIUM",
            status: "IN_PROGRESS",
            location_address: "Residential Park, Sector 4",
            department_id: "dept_lighting",
            assigned_team: "Local Maintenance"
          },
          {
            sla_id: "sla_005",
            grievance_id: "grievance_105",
            grid_id: "GRI-2026-000112",
            sla_type: "RESPONSE",
            deadline_at: new Date(Date.now() - 21600000).toISOString(),
            escalation_level: 2,
            title: "HIGH: Traffic signal failure - Junction 9",
            priority: "HIGH",
            status: "ESCALATED",
            location_address: "Cyber Hub Crossing",
            department_id: "dept_traffic",
            assigned_team: "Signals Division Blue"
          },
          {
            sla_id: "sla_006",
            grievance_id: "grievance_106",
            grid_id: "GRI-2026-000115",
            sla_type: "RESOLUTION",
            deadline_at: new Date(Date.now() - 5400000).toISOString(),
            escalation_level: 1,
            title: "MEDIUM: Garbage collection delay",
            priority: "MEDIUM",
            status: "SCHEDULED",
            location_address: "South Extension, Block A",
            department_id: "dept_sanitation",
            assigned_team: "Sanitation Unit 4"
          },
          {
            sla_id: "sla_007",
            grievance_id: "grievance_107",
            grid_id: "GRI-2026-000120",
            sla_type: "RESPONSE",
            deadline_at: new Date(Date.now() - 10800000).toISOString(),
            escalation_level: 3,
            title: "CRITICAL: Flooding reported in underpass",
            priority: "CRITICAL",
            status: "ESCALATED",
            location_address: "Central Square Underpass",
            department_id: "dept_drainage",
            assigned_team: "Emergency Drainage"
          },
          {
            sla_id: "sla_008",
            grievance_id: "grievance_108",
            grid_id: "GRI-2026-000125",
            sla_type: "RESOLUTION",
            deadline_at: new Date(Date.now() - 86400000).toISOString(),
            escalation_level: 4,
            title: "CRITICAL: Sewage backup in hospital area",
            priority: "CRITICAL",
            status: "ESCALATED",
            location_address: "Medical City District",
            department_id: "dept_sewage",
            assigned_team: "Elite Response 9"
          }
        ]
      };
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
