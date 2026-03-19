// Mock service for Grievance Tracking

export interface TrackingNode {
  id: string;
  title: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  timestamp?: string;
  description?: string;
}

export interface TrackingInfo {
  grid_id: string;
  current_status: string;
  nodes: TrackingNode[];
  team?: {
    name: string;
    contact: string;
    eta_minutes: number;
    lat: number;
    lng: number;
  };
}

export const trackingService = {
  getTrackingInfo: async (grid_id: string): Promise<TrackingInfo> => {
    console.log(`[API MOCK] Fetching tracking info for Grid ID: ${grid_id}`);
    
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      grid_id: grid_id || 'GRV-DEMO',
      current_status: 'IN_PROGRESS',
      nodes: [
        {
          id: 'n1',
          title: 'Grievance Intercepted',
          status: 'COMPLETED',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          description: 'AI successfully analyzed and categorized the report.'
        },
        {
          id: 'n2',
          title: 'Department Assigned',
          status: 'COMPLETED',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          description: 'Routed to Node-VII (Sanitation & Water Works).'
        },
        {
          id: 'n3',
          title: 'Field Team Dispatched',
          status: 'ACTIVE',
          timestamp: new Date().toISOString(),
          description: 'Alpha Unit 4 is en route to the coordinate.'
        },
        {
          id: 'n4',
          title: 'Verifiable Resolution',
          status: 'PENDING',
          description: 'Awaiting geo-tagged proof of resolution.'
        }
      ],
      team: {
        name: 'Alpha Unit 4',
        contact: '+91-9876543210',
        eta_minutes: 15,
        lat: 28.6139,
        lng: 77.2090
      }
    };
  }
};
