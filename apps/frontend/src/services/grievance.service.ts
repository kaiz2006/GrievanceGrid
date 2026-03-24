// Grievance Service for GrievanceGrid
// Following API SPEC Sections 1, 3, 4, 9, 10
import { apiClient, mockDelay } from "./api.client";
import { GrievanceDetail, GrievanceStatus } from "@/types";
import { getMockGrievances, saveMockGrievance, getMockGrievanceById } from "@/lib/mockStore";

// Mock data generators
const generateGridId = () => `GRI-2026-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

export const grievanceService = {
  // POST /grievances - Submit new grievance
  submit: async (data: any) => {
    return apiClient.post("/grievances", data, async () => {
      await mockDelay(500);
      const newGrievance: GrievanceDetail = {
        id: `m_${Date.now()}`,
        grid_id: generateGridId(),
        category: data.category || "UNCLASSIFIED",
        priority: "NORMAL",
        status: "CREATED",
        title: data.title || "New Grievance",
        description: data.description || "No description provided",
        location: data.location || { latitude: 0, longitude: 0, address: "Unknown" },
        created_at: new Date().toISOString(),
        timeline: [
          { status: "CREATED", timestamp: new Date().toISOString(), description: "Grievance submitted" }
        ],
        sla: {
          response_sla: { deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
          resolution_sla: { deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() }
        }
      };
      saveMockGrievance(newGrievance);
      return newGrievance;
    });
  },

  // GET /track/{grid_id} - Live package-style tracking
  getTrack: async (gridId: string): Promise<any> => {
    return apiClient.get(`/track/${gridId}`, async () => {
      await mockDelay(200);
      const grievances = getMockGrievances();
      const match = grievances.find(g => g.grid_id === gridId);
      if (match) {
        return {
          grid_id: gridId,
          current_status: match.status,
          timeline: match.timeline,
          sla: match.sla,
          assigned_team: { name: "Team Alpha-3", contact: "+91-98765-43210", eta_minutes: 15 }
        };
      }
      throw new Error("Grievance not found");
    });
  },

  // GET /grievances/{id} - Get grievance details
  getDetail: async (id: string): Promise<GrievanceDetail> => {
    return apiClient.get(`/grievances/${id}`, async () => {
      await mockDelay(300);
      const match = getMockGrievanceById(id);
      if (match) return match;
      throw new Error("Grievance not found");
    });
  },

  // PATCH /grievances/{id}/status - Update grievance status
  updateStatus: async (id: string, status: GrievanceStatus, notes: string) => {
    return apiClient.patch(`/grievances/${id}/status`, { status, notes }, async () => {
      await mockDelay(200);
      const g = getMockGrievanceById(id);
      if (g) {
        g.status = status;
        g.timeline.unshift({
          status: status,
          timestamp: new Date().toISOString(),
          description: notes || `Status updated to ${status}`
        });
        saveMockGrievance(g);
      }
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

  // GET /grievances/me - Get current user's grievances (For demo, just returns all)
  getMyGrievances: async (limit: number = 20, offset: number = 0) => {
    return apiClient.get(`/grievances/me?limit=${limit}&offset=${offset}`, async () => {
      await mockDelay(300);
      return { grievances: getMockGrievances(), total: getMockGrievances().length };
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
