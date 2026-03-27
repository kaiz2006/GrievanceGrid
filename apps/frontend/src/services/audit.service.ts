// Audit Service for GrievanceGrid
// Following API SPEC - Contestation & Audit endpoints
import { apiClient } from "./api.client";

export interface AuditListItem {
  audit_id: string;
  grievance_id: string;
  grid_id: string;
  reason: string;
  status: string;
  risk_score?: number;
  created_at: string;
}

export interface AuditListResponse {
  count: number;
  audits: AuditListItem[];
}

export interface AuditDetailResponse {
  audit_id: string;
  grievance_id: string;
  grid_id: string;
  title: string;
  description: string;
  reason: string;
  evidence_photo_url?: string;
  status: string;
  risk_score?: number;
  ai_recommendation?: string;
  ai_confidence?: number;
  validation_notes?: string;
  validated_by?: string;
  validated_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuditValidationRequest {
  action: "approve" | "reject";
  notes?: string;
}

export interface AuditValidationResponse {
  audit_id: string;
  grievance_id: string;
  action: string;
  status: string;
  validated_by: string;
  validated_at: string;
  message: string;
}

export interface AuditStatsResponse {
  total_contested: number;
  pending_review: number;
  approved: number;
  rejected: number;
  approval_rate: number;
  avg_risk_score?: number;
}

// Supported audit statuses
export type AuditStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export const auditService = {
  // GET /audits - Get pending audits (with optional status filter)
  getPendingAudits: async (status?: AuditStatus, limit = 50, offset = 0): Promise<AuditListResponse> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());
    
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get(`/audits${query}`);
  },

  // GET /audits/{audit_id} - Get audit detail
  getAuditDetail: async (auditId: string): Promise<AuditDetailResponse> => {
    return apiClient.get(`/audits/${auditId}`);
  },

  // POST /audits/{audit_id}/validate - Validate audit (approve/reject)
  validateAudit: async (auditId: string, action: "approve" | "reject", notes?: string): Promise<AuditValidationResponse> => {
    const payload: AuditValidationRequest = { action, notes };
    return apiClient.post(`/audits/${auditId}/validate`, payload);
  },

  // GET /audits/stats - Get audit statistics
  getAuditStats: async (): Promise<AuditStatsResponse> => {
    return apiClient.get("/audits/stats");
  }
};
