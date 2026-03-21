// Audit Service for GrievanceGrid
// Following API SPEC - Contestation & Audit endpoints
import { apiClient, mockDelay } from "./api.client";

export interface AuditEvent {
  id: string;
  event_type: string;
  old_status: string | null;
  new_status: string | null;
  description: string | null;
  actor_name: string | null;
  created_at: string;
}

export interface AuditHistoryResponse {
  grievance_id: string;
  count: number;
  events: AuditEvent[];
}

export interface ContestationResult {
  status: string;
  audit_triggered: boolean;
  audit_id: string;
  audit_task_id: string;
  message: string;
}

export interface AuditResult {
  audit_id: string;
  grievance_id: string;
  reason: string;
  evidence_photo: string | null;
  risk_score: number;
  evidence_severity: number | null;
  recommendation: string;
  status: string;
  processed_at: string;
  ai_confidence?: number;
  validation_notes?: string;
}

export const auditService = {
  // GET /admin/grievances/{grievance_id}/audit - Get audit history
  getAuditHistory: async (grievanceId: string): Promise<AuditHistoryResponse> => {
    return apiClient.get(`/admin/grievances/${grievanceId}/audit`, async () => {
      await mockDelay(300);
      
      return {
        grievance_id: grievanceId,
        count: 5,
        events: [
          {
            id: "evt_001",
            event_type: "CREATED",
            old_status: null,
            new_status: "CREATED",
            description: "Grievance submitted by citizen",
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
            description: "Assigned to PWD Department, Team Alpha-3",
            actor_name: "GNN Router",
            created_at: new Date(Date.now() - 86200000).toISOString()
          },
          {
            id: "evt_004",
            event_type: "IN_PROGRESS",
            old_status: "ROUTED",
            new_status: "IN_PROGRESS",
            description: "Repair work started",
            actor_name: "Rajesh Kumar",
            created_at: new Date(Date.now() - 43200000).toISOString()
          },
          {
            id: "evt_005",
            event_type: "CONTESTED",
            old_status: "RESOLVED",
            new_status: "CONTESTED",
            description: "Citizen contested resolution",
            actor_name: "John Doe",
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      };
    });
  },

  // GET /audits/{audit_id} - Get audit result
  getAuditResult: async (auditId: string): Promise<AuditResult> => {
    return apiClient.get(`/audits/${auditId}`, async () => {
      await mockDelay(350);
      
      return {
        audit_id: auditId,
        grievance_id: "grievance_123",
        reason: "The work was not done properly. Pothole has returned within 2 days.",
        evidence_photo: "https://example.com/evidence.jpg",
        risk_score: 0.72,
        evidence_severity: 0.65,
        recommendation: "Reassign to senior officer for field verification. Previous resolution appears incomplete.",
        status: "AUDIT_QUEUED",
        processed_at: new Date().toISOString(),
        ai_confidence: 0.89,
        validation_notes: "Evidence photo shows recurring damage pattern"
      };
    });
  },

  // GET /audits - Get pending audits
  getPendingAudits: async (): Promise<AuditResult[]> => {
    return apiClient.get("/audits?status=pending", async () => {
      await mockDelay(400);
      
      return [
        {
          audit_id: "audit_001",
          grievance_id: "grievance_123",
          reason: "Pothole returned within 2 days of repair",
          evidence_photo: null,
          risk_score: 0.72,
          evidence_severity: 0.65,
          recommendation: "Reassign for field verification",
          status: "AUDIT_QUEUED",
          processed_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          audit_id: "audit_002",
          grievance_id: "grievance_456",
          reason: "Water leak not fully resolved",
          evidence_photo: "https://example.com/ev2.jpg",
          risk_score: 0.85,
          evidence_severity: 0.78,
          recommendation: "Escalate to senior engineer",
          status: "UNDER_REVIEW",
          processed_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          audit_id: "audit_003",
          grievance_id: "grievance_789",
          reason: "Street light still not working after reported fix",
          evidence_photo: "https://example.com/ev3.jpg",
          risk_score: 0.58,
          evidence_severity: 0.45,
          recommendation: "Schedule re-inspection",
          status: "AUDIT_QUEUED",
          processed_at: new Date(Date.now() - 1800000).toISOString()
        }
      ];
    });
  },

  // POST /audits/{audit_id}/validate - Validate audit (approve/reject)
  validateAudit: async (auditId: string, isValid: boolean, notes: string) => {
    return apiClient.post(`/audits/${auditId}/validate`, { is_valid: isValid, notes }, async () => {
      await mockDelay(400);
      return {
        audit_id: auditId,
        status: isValid ? "RESOLVED_VALID" : "RESOLVED_INVALID",
        processed_at: new Date().toISOString(),
        message: isValid ? "Grievance re-opened for resolution" : "Original resolution upheld"
      };
    });
  },

  // GET /audits/stats - Get audit statistics
  getAuditStats: async () => {
    return apiClient.get("/audits/stats", async () => {
      await mockDelay(250);
      return {
        total_pending: 12,
        avg_resolution_hours: 4.2,
        validation_rate: 0.68,
        rejection_rate: 0.32,
        by_status: {
          AUDIT_QUEUED: 5,
          UNDER_REVIEW: 4,
          RESOLVED_VALID: 2,
          RESOLVED_INVALID: 1
        }
      };
    });
  }
};
