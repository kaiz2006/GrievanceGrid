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

export interface AuditResult {
  audit_id: string;
  grievance_id: string;
  grid_id: string;
  reason: string;
  status: string;
  risk_score: number;
  evidence_photo?: string;
  evidence_severity: number | null;
  processed_at: string;
  recommendation: string;
}

export interface ContestationResult {
  status: string;
  audit_triggered: boolean;
  audit_id: string;
  message: string;
}

export interface AuditEvent {
  id: string;
  grievance_id: string;
  event_type: string;
  old_status?: string;
  new_status?: string;
  description: string;
  actor_name: string;
  created_at: string;
}

export interface AuditHistoryResponse {
  grievance_id: string;
  count: number;
  events: AuditEvent[];
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
    return await apiClient.get<AuditListResponse>(`/audits${query}`);
  },

  // GET /audits/{audit_id} - Get audit detail
  getAuditDetail: async (auditId: string): Promise<AuditDetailResponse> => {
    return await apiClient.get<AuditDetailResponse>(`/audits/${auditId}`);
  },

  // GET /audits/{audit_id} (UI-friendly shape for contestation page)
  getAuditResult: async (auditId: string): Promise<AuditResult> => {
    const detail = await auditService.getAuditDetail(auditId);
    const normalizedRisk = typeof detail.risk_score === "number"
      ? detail.risk_score > 1
        ? detail.risk_score / 100
        : detail.risk_score
      : 0.5;

    return {
      audit_id: detail.audit_id,
      grievance_id: detail.grievance_id,
      grid_id: detail.grid_id,
      reason: detail.reason,
      status: detail.status,
      risk_score: normalizedRisk,
      evidence_photo: detail.evidence_photo_url,
      evidence_severity: detail.ai_confidence ?? null,
      processed_at: detail.updated_at || detail.created_at,
      recommendation: detail.ai_recommendation || "Proceed with manual validation by audit team.",
    };
  },

  // POST /audits/{audit_id}/validate - Validate audit (approve/reject)
  validateAudit: async (auditId: string, action: "approve" | "reject", notes?: string): Promise<AuditValidationResponse> => {
    const payload: AuditValidationRequest = { action, notes };
    return apiClient.post(`/audits/${auditId}/validate`, payload);
  },

  // GET /audits/stats - Get audit statistics
  getAuditStats: async (): Promise<AuditStatsResponse> => {
    return await apiClient.get<AuditStatsResponse>("/audits/stats");
  },

  // GET /grievances/{grievance_id}/audit - Full immutable timeline
  getAuditHistory: async (grievanceId: string): Promise<AuditHistoryResponse> => {
    return await apiClient.get<AuditHistoryResponse>(`/grievances/${grievanceId}/audit`);
  }
};
