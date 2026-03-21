// Grievance Service for GrievanceGrid
// Following API SPEC Sections 1, 3, 4, 9, 10
import { apiClient, mockDelay } from "./api.client";
import { GrievanceDetail, GrievanceStatus } from "@/types";

// Mock data generators
const generateGridId = () => `GRI-2026-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

export const grievanceService = {
  // POST /grievances - Submit new grievance
  submit: async (data: any) => {
    return apiClient.post("/grievances", data, async () => {
      await mockDelay(500);
      return {
        grid_id: generateGridId(),
        status: "CREATED",
        sla_response_deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        sla_resolution_deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        message: "Grievance submitted successfully."
      };
    });
  },

  // GET /track/{grid_id} - Live package-style tracking
  getTrack: async (gridId: string): Promise<any> => {
    return apiClient.get(`/track/${gridId}`, async () => {
      await mockDelay(200);
      return {
        grid_id: gridId,
        current_status: "IN_PROGRESS",
        timeline: [
          { status: "CREATED", timestamp: new Date(Date.now() - 3600000).toISOString(), description: "Grievance submitted" },
          { status: "AI_PROCESSED", timestamp: new Date(Date.now() - 3500000).toISOString(), description: "AI categorized: ROADS" },
          { status: "ROUTED", timestamp: new Date(Date.now() - 3400000).toISOString(), description: "Routed to PWD" },
          { status: "IN_PROGRESS", timestamp: new Date(Date.now() - 1200000).toISOString(), description: "Work started", eta: new Date(Date.now() + 3600000).toISOString() }
        ],
        sla: {
          resolution_sla: { deadline: new Date(Date.now() + 86400000).toISOString(), remaining_hours: 24 }
        },
        assigned_team: { name: "Team Alpha-3", contact: "+91-98765-43210", eta_minutes: 15 }
      };
    });
  },

  // GET /grievances/{id} - Get grievance details
  getDetail: async (id: string): Promise<GrievanceDetail> => {
    return apiClient.get(`/grievances/${id}`, async () => {
      await mockDelay(300);
      return {
        id,
        grid_id: "GRI-2026-000102",
        category: "ROADS",
        priority: "HIGH",
        status: "IN_PROGRESS",
        title: "Broken Road Divider",
        description: "Hazardous debris on Sector 14 flyover.",
        location: { latitude: 28.6, longitude: 77.2, address: "Sector 14 Flyover" },
        timeline: [],
        sla: {
          response_sla: { deadline: "" },
          resolution_sla: { deadline: "" }
        }
      };
    });
  },

  // PATCH /grievances/{id}/status - Update grievance status
  updateStatus: async (id: string, status: GrievanceStatus, notes: string) => {
    return apiClient.patch(`/grievances/${id}/status`, { status, notes }, async () => {
      await mockDelay(200);
      return { success: true, grievance_id: id, new_status: status };
    });
  },

  // POST /grievances/{id}/feedback - Submit citizen feedback
  submitFeedback: async (id: string, feedback: { rating: number; comment: string; is_satisfied: boolean }) => {
    return apiClient.post(`/grievances/${id}/feedback`, feedback, async () => {
      await mockDelay(300);
      return { success: true, message: "Feedback submitted successfully" };
    });
  },

  // POST /grievances/{id}/contest - Contest resolution
  contest: async (id: string, reason: string, evidencePhoto?: string) => {
    return apiClient.post(`/grievances/${id}/contest`, { reason, evidence_photo: evidencePhoto }, async () => {
      await mockDelay(400);
      return {
        status: "CONTESTED",
        audit_triggered: true,
        audit_id: `audit_${Date.now()}`,
        message: "Contestation received. AI audit initiated."
      };
    });
  },

  // POST /verify - Submit resolution verification (two-factor)
  submitVerification: async (grievanceId: string, photo: File, location: { latitude: number; longitude: number }, notes: string) => {
    return apiClient.post("/verify", { grievance_id: grievanceId, location, notes }, async () => {
      await mockDelay(500);
      return {
        verification_id: `ver_${Date.now()}`,
        is_valid: true,
        distance_from_incident: "12 meters",
        message: "Verification accepted. Grievance marked for closure."
      };
    });
  },

  // GET /grievances/me - Get current user's grievances
  getMyGrievances: async (limit: number = 20, offset: number = 0) => {
    return apiClient.get(`/grievances/me?limit=${limit}&offset=${offset}`, async () => {
      await mockDelay(350);
      return {
        count: 4,
        items: [
          {
            id: "grievance_001",
            grid_id: "GRI-2026-008821",
            title: "Street Light Failure",
            category: "Infrastructure",
            status: "IN_PROGRESS",
            priority: "HIGH",
            description: "Main street lights have been off for three days, creating safety concerns at night.",
            location: "Park Avenue, Sector 4",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            can_feedback: false,
            can_contest: false
          },
          {
            id: "grievance_002",
            grid_id: "GRI-2026-007740",
            title: "Water Leakage",
            category: "Utilities",
            status: "RESOLVED",
            priority: "MEDIUM",
            description: "Major pipe burst near the community center is wasting significant water.",
            location: "Oak Drive, Block B",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            resolved_at: new Date(Date.now() - 86400000).toISOString(),
            can_feedback: true,
            can_contest: true
          },
          {
            id: "grievance_003",
            grid_id: "GRI-2026-007650",
            title: "Pothole on Main Road",
            category: "Roads",
            status: "PENDING",
            priority: "HIGH",
            description: "Large pothole causing traffic issues and vehicle damage.",
            location: "Main Road, Near Market",
            created_at: new Date(Date.now() - 43200000).toISOString(),
            can_feedback: false,
            can_contest: false
          },
          {
            id: "grievance_004",
            grid_id: "GRI-2026-007500",
            title: "Garbage Collection",
            category: "Sanitation",
            status: "RESOLVED",
            priority: "LOW",
            description: "Garbage not collected for 3 days in residential area.",
            location: "Rose Colony, Block C",
            created_at: new Date(Date.now() - 259200000).toISOString(),
            resolved_at: new Date(Date.now() - 172800000).toISOString(),
            can_feedback: false,
            can_contest: false
          }
        ]
      };
    });
  },

  // GET /grievances/{id}/similar - Get similar cases via vector search
  getSimilarCases: async (grievanceId: string, limit: number = 5) => {
    return apiClient.get(`/grievances/${grievanceId}/similar?limit=${limit}`, async () => {
      await mockDelay(400);
      return {
        count: 3,
        cases: [
          {
            grid_id: "GRI-2026-000089",
            title: "Pothole on Sector 15 Main Road",
            similarity_score: 0.94,
            resolution_summary: "Filled with asphalt mix, leveled with road surface.",
            resolution_time_hours: 18,
            department: "PWD"
          },
          {
            grid_id: "GRI-2026-000067",
            title: "Road damage near traffic signal",
            similarity_score: 0.87,
            resolution_summary: "Emergency repair completed.",
            resolution_time_hours: 24,
            department: "PWD"
          },
          {
            grid_id: "GRI-2026-000045",
            title: "Large crater on highway service road",
            similarity_score: 0.82,
            resolution_summary: "Major repair with concrete base.",
            resolution_time_hours: 12,
            department: "PWD"
          }
        ]
      };
    });
  }
};
