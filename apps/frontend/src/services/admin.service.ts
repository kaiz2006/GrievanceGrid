// Admin Service for GrievanceGrid
// Following API SPEC Sections 7, 8 - Admin & Analytics
import { apiClient, mockDelay } from "./api.client";

export const adminService = {
  // GET /analytics/dashboard - Dashboard analytics
  getDashboard: async (fromDate?: string, toDate?: string) => {
    const params = fromDate && toDate ? `?from=${fromDate}&to=${toDate}` : "";
    return apiClient.get(`/analytics/dashboard${params}`, async () => {
      await mockDelay(300);
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
          { id: "alt_1", type: "Transformer", asset_id: "T-1234", failure_probability: 0.78, message: "Transformer T-1234: 78% failure risk" },
          { id: "alt_2", type: "Water Main", asset_id: "W-55", failure_probability: 0.85, message: "Water main near Sector 15: Likely leak" }
        ]
      };
    });
  },

  // GET /clusters - Get geospatial clusters
  getClusters: async (type: string = "DBSCAN", activeOnly: boolean = true) => {
    return apiClient.get(`/clusters?type=${type}&active=${activeOnly}`, async () => {
      await mockDelay(400);
      return {
        clusters: [
          {
            cluster_id: "cluster_001",
            type: "DBSCAN_GEO",
            location: { lat: 28.6150, lng: 77.2100 },
            radius_meters: 500,
            grievance_count: 23,
            crisis_score: 0.85,
            topics: ["water_leak", "drainage"],
            recommended_action: "URGENT: Infrastructure inspection needed"
          },
          {
            cluster_id: "cluster_002",
            type: "DBSCAN_GEO",
            location: { lat: 28.6320, lng: 77.2180 },
            radius_meters: 350,
            grievance_count: 15,
            crisis_score: 0.62,
            topics: ["power_outage", "transformer"],
            recommended_action: "Schedule maintenance check"
          }
        ]
      };
    });
  },

  // POST /clusters/recluster - Trigger recluster
  triggerRecluster: async () => {
    return apiClient.post("/clusters/recluster", {}, async () => {
      await mockDelay(300);
      return {
        task_id: `task_${Date.now()}`,
        scheduled_at: new Date().toISOString()
      };
    });
  },

  // GET /admin/escalations - List escalated grievances
  getEscalations: async (limit: number = 100) => {
    return apiClient.get(`/admin/escalations?limit=${limit}`, async () => {
      await mockDelay(350);
      return {
        count: 3,
        items: [
          {
            grievance_id: "grievance_101",
            grid_id: "GRI-2026-000101",
            title: "Major water pipeline leak",
            status: "ESCALATED",
            priority: "CRITICAL",
            assigned_department_id: "dept_water",
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            grievance_id: "grievance_102",
            grid_id: "GRI-2026-000102",
            title: "Power outage in industrial area",
            status: "ESCALATED",
            priority: "HIGH",
            assigned_department_id: "dept_electricity",
            created_at: new Date(Date.now() - 7200000).toISOString()
          },
          {
            grievance_id: "grievance_103",
            grid_id: "GRI-2026-000103",
            title: "Contested resolution - Road repair",
            status: "CONTESTED",
            priority: "HIGH",
            assigned_department_id: "dept_pwd",
            created_at: new Date(Date.now() - 5400000).toISOString()
          }
        ]
      };
    });
  },

  // GET /admin/sla-breaches - List SLA breaches
  getSLABreaches: async (departmentId?: string, limit: number = 100) => {
    const deptParam = departmentId ? `&department=${departmentId}` : "";
    return apiClient.get(`/admin/sla-breaches?limit=${limit}${deptParam}`, async () => {
      await mockDelay(400);
      return {
        count: 2,
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
            location_address: "Sector 15, Main Road"
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
            location_address: "Industrial Area, Block B"
          }
        ]
      };
    });
  },

  // PATCH /admin/grievances/{id}/assign-department - Assign department
  assignDepartment: async (grievanceId: string, departmentId: string) => {
    return apiClient.patch(`/admin/grievances/${grievanceId}/assign-department`, { department_id: departmentId }, async () => {
      await mockDelay(300);
      return {
        grievance_id: grievanceId,
        status: "ROUTED",
        department_id: departmentId
      };
    });
  },

  // GET /admin/grievances/{id}/audit - Get audit history
  getAuditHistory: async (grievanceId: string) => {
    return apiClient.get(`/admin/grievances/${grievanceId}/audit`, async () => {
      await mockDelay(350);
      return {
        grievance_id: grievanceId,
        count: 4,
        events: [
          {
            id: "evt_001",
            event_type: "CREATED",
            old_status: null,
            new_status: "CREATED",
            description: "Grievance submitted",
            actor_name: "John Doe",
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: "evt_002",
            event_type: "AI_PROCESSED",
            old_status: "CREATED",
            new_status: "AI_PROCESSED",
            description: "AI categorized as ROADS, Priority: HIGH",
            actor_name: "AI System",
            created_at: new Date(Date.now() - 86300000).toISOString()
          },
          {
            id: "evt_003",
            event_type: "ROUTED",
            old_status: "AI_PROCESSED",
            new_status: "ROUTED",
            description: "Assigned to PWD Department",
            actor_name: "GNN Router",
            created_at: new Date(Date.now() - 86200000).toISOString()
          },
          {
            id: "evt_004",
            event_type: "IN_PROGRESS",
            old_status: "ROUTED",
            new_status: "IN_PROGRESS",
            description: "Work started",
            actor_name: "Rajesh Kumar",
            created_at: new Date(Date.now() - 43200000).toISOString()
          }
        ]
      };
    });
  },

  // GET /admin/departments - Get all departments
  getDepartments: async () => {
    return apiClient.get("/admin/departments", async () => {
      await mockDelay(250);
      return {
        count: 6,
        items: [
          { id: "dept_pwd", name: "Public Works Department", code: "PWD" },
          { id: "dept_water", name: "Water Supply Department", code: "WSD" },
          { id: "dept_electricity", name: "Electricity Department", code: "ED" },
          { id: "dept_sanitation", name: "Sanitation Department", code: "SD" },
          { id: "dept_roads", name: "Roads & Transport", code: "R&T" },
          { id: "dept_parks", name: "Parks & Recreation", code: "P&R" }
        ]
      };
    });
  },

  // GET /admin/teams - Get all field teams
  getTeams: async (departmentId?: string) => {
    const params = departmentId ? `?department=${departmentId}` : "";
    return apiClient.get(`/admin/teams${params}`, async () => {
      await mockDelay(300);
      return {
        count: 4,
        items: [
          { id: "team_alpha1", name: "Team Alpha-1", department_id: "dept_pwd", status: "available", current_location: { lat: 28.61, lng: 77.20 } },
          { id: "team_alpha2", name: "Team Alpha-2", department_id: "dept_pwd", status: "busy", current_location: { lat: 28.62, lng: 77.21 } },
          { id: "team_beta1", name: "Team Beta-1", department_id: "dept_water", status: "available", current_location: { lat: 28.60, lng: 77.19 } },
          { id: "team_gamma1", name: "Team Gamma-1", department_id: "dept_electricity", status: "available", current_location: { lat: 28.63, lng: 77.22 } }
        ]
      };
    });
  },

  // POST /admin/grievances/{id}/assign-team - Assign team to grievance
  assignTeam: async (grievanceId: string, teamId: string) => {
    return apiClient.post(`/admin/grievances/${grievanceId}/assign-team`, { team_id: teamId }, async () => {
      await mockDelay(300);
      return {
        grievance_id: grievanceId,
        team_id: teamId,
        status: "ASSIGNED",
        eta_minutes: 15
      };
    });
  }
};
