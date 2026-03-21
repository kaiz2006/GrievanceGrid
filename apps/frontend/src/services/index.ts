// Services Index - Export all services from a single entry point
// This makes imports cleaner: import { grievanceService, adminService } from "@/services";

// API Client
export { apiClient, mockDelay, API_BASE_URL, USE_MOCK_API } from "./api.client";

// Core Services
export { grievanceService } from "./grievance.service";
export type { GrievanceDetail, GrievanceStatus } from "@/types";

export { authService } from "./auth.service";
export type { User, AuthResponse } from "./auth.service";

export { voiceService } from "./voice.service";
export type { VoiceProcessResult, VoiceResultDetail } from "./voice.service";

// Admin & Analytics Services
export { adminService } from "./admin.service";

export { clusterService } from "./cluster.service";
export type { ClusterItem, ClusterListResponse, ReclusterResponse } from "./cluster.service";

export { infrastructureService } from "./infrastructure.service";
export type { InfrastructureAsset, RiskUpdatePayload } from "./infrastructure.service";

export { auditService } from "./audit.service";
export type { AuditEvent, AuditHistoryResponse, AuditResult, ContestationResult } from "./audit.service";

export { slaService } from "./sla.service";
export type { SLABreachItem, SLABreachResponse, SLATimer, SLAStats } from "./sla.service";
