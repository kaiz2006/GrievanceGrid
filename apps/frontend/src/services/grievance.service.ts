// Mock Grievance Service for GrievanceGrid
// Following API SPEC Sections 1, 3, 4, 9, 10
import { GrievanceDetail, GrievanceStatus } from "@/types";

export const grievanceService = {
  submit: async (data: any) => {
    console.log(`[API CALL]: POST /grievances`, data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      grid_id: `GRI-2026-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      status: "CREATED",
      sla_response_deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      sla_resolution_deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      message: "Grievance submitted successfully via mock API."
    };
  },

  getTrack: async (gridId: string): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
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
  },

  getDetail: async (id: string): Promise<GrievanceDetail> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
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
  },

  updateStatus: async (id: string, status: GrievanceStatus, notes: string) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true };
  },

  submitFeedback: async (id: string, feedback: any) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },

  contest: async (id: string, reason: string) => {
    console.log(`[API CALL]: POST /grievances/${id}/contest`, { reason });
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { status: "CONTESTED", audit_triggered: true };
  }
};
