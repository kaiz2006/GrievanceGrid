import { apiClient } from './api.client';

export interface AssignmentStatus {
  grievance_id: string;
  grid_id: string;
  status: string;
  assigned_team_id: string;
  created_at: string;
  priority: number;
  category: string;
  location_city: string;
  location_coordinates: string;
  damage_description: string;
  damage_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | number;
  ai_summary: string;
  reporter_name: string;
  reporter_email: string;
  contact_phone: string;
}

export interface CrewAssignment {
  grievance_id: string;
  grid_id: string;
  status: string;
  assigned_team_id: string;
  assigned_team_name?: string;
  title?: string;
  citizen_phone?: string;
  ai_category?: string;
  ai_priority?: string;
  created_at: string;
  updated_at?: string;
  priority: number;
  category: string;
  location_city: string;
  location_coordinates: string;
  damage_description: string;
  damage_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | number;
  ai_summary: string;
  reporter_name: string;
  reporter_email: string;
  contact_phone: string;
}

export interface AssignmentsResponse {
  items: CrewAssignment[];
  count: number;
  total: number;
  total_count?: number;
  total_active?: number;
}

export interface CrewProfile {
  id: string;
  name: string;
  email: string;
  team_id: string;
  team_name?: string;
  role: string;
  team_assignments_count: number;
  active_assignments_count: number;
}

export const crewService = {
  async getProfile(): Promise<CrewProfile> {
    return await apiClient.get<CrewProfile>('/crew/profile');
  },

  async getAssignments(status?: string, limit: number = 20, offset: number = 0): Promise<AssignmentsResponse> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    return await apiClient.get<AssignmentsResponse>(`/crew/assignments?${params.toString()}`);
  },

  async updateStatus(grievanceId: string, status: string, notes?: string): Promise<any> {
    return await apiClient.patch(`/crew/assignments/${grievanceId}/status`, { status, notes });
  }
};
