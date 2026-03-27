import { apiClient } from './api.client';

export interface AssignmentStatus {
  grievance_id: string;
  status: string;
  assigned_team_id: string;
  created_at: string;
  priority: number;
  category: string;
  location_city: string;
  location_coordinates: string;
  damage_description: string;
  damage_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ai_summary: string;
  reporter_name: string;
  reporter_email: string;
  contact_phone: string;
}

export interface CrewAssignment {
  grievance_id: string;
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
  damage_severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
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
    try {
      const data = await apiClient.get<CrewProfile>('/crew/profile');
      return data;
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock crew profile.');
      return {
        id: "crew_001",
        name: "Lead Tech Alex",
        email: "alex.tech@grievancegrid.gov",
        team_id: "team_alpha",
        team_name: "Rapid Response Alpha",
        role: "LEAD_OFFICER",
        team_assignments_count: 124,
        active_assignments_count: 3
      };
    }
  },

  async getAssignments(status?: string, limit: number = 20, offset: number = 0): Promise<AssignmentsResponse> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      const data = await apiClient.get<AssignmentsResponse>(`/crew/assignments?${params.toString()}`);
      return data;
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock crew assignments.');
      return {
        count: 3,
        total: 3,
        items: [
          {
            grievance_id: "g_001",
            grid_id: "GRI-2026-X8B2",
            status: "IN_PROGRESS",
            assigned_team_id: "team_alpha",
            assigned_team_name: "Rapid Response Alpha",
            title: "Main Sector Power Leak",
            ai_category: "INFRASTRUCTURE",
            ai_priority: "CRITICAL",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            priority: 1,
            category: "Electricity",
            location_city: "Sector 4",
            location_coordinates: "12.9716, 77.5946",
            damage_description: "Exposed wiring near central junction.",
            damage_severity: 'CRITICAL',
            ai_summary: "High risk of fire. Immediate containment required.",
            reporter_name: "John Citizen",
            reporter_email: "john@example.com",
            contact_phone: "+91 98765 43210"
          },
          {
            grievance_id: "g_002",
            grid_id: "GRI-2026-K9P1",
            status: "ASSIGNED",
            assigned_team_id: "team_alpha",
            assigned_team_name: "Rapid Response Alpha",
            title: "Pipeline Pressure Drop",
            ai_category: "WATER_SUPPLY",
            ai_priority: "HIGH",
            created_at: new Date(Date.now() - 43200000).toISOString(),
            priority: 2,
            category: "Water",
            location_city: "Sector 7",
            location_coordinates: "12.9720, 77.5950",
            damage_description: "Slow leak reported by pressure sensors.",
            damage_severity: 'HIGH',
            ai_summary: "Potential pipe burst if pressure is not regulated.",
            reporter_name: "Sarah Smith",
            reporter_email: "sarah@example.com",
            contact_phone: "+91 98765 43211"
          }
        ]
      };
    }
  }
};
