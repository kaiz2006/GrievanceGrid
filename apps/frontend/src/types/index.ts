// Common Types for GrievanceGrid
// Based on docs/API_SPEC.md

export type UserRole = "CITIZEN" | "CREW" | "OFFICER" | "ADMIN" | "AUDITOR";

export type GrievanceStatus = 
  | "CREATED"
  | "PENDING"
  | "PENDING_CLASSIFICATION"
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "AI_PROCESSED" 
  | "ROUTED" 
  | "ACKNOWLEDGED" 
  | "IN_PROGRESS" 
  | "ESCALATED"
  | "VERIFIED" 
  | "RESOLVED" 
  | "CONTESTED"
  | "CLOSED";

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface TimelineEvent {
  status: GrievanceStatus;
  timestamp: string;
  description: string;
  eta?: string;
}

export interface SLAInfo {
  deadline: string;
  remaining_hours?: number;
  status?: "ON_TRACK" | "AT_RISK" | "VIOLATED";
}

export interface TeamInfo {
  name: string;
  contact: string;
  current_location?: Location;
  eta_minutes?: number;
}

export interface GrievanceDetail {
  id: string;
  grid_id: string;
  category: string;
  priority: string;
  status: GrievanceStatus;
  title: string;
  description: string;
  location: Location;
  timeline: TimelineEvent[];
  sla: {
    response_sla: SLAInfo;
    resolution_sla: SLAInfo;
  };
  assigned_team?: TeamInfo;
  created_at?: string;
  resolved_at?: string;
}
