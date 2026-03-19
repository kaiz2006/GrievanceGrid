// Mock service for Grievance Submission & Management

export interface Grievance {
  id: string;
  status: string;
  category: string;
  description: string;
  date: string;
}

export interface GrievancePayload {
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  attachments?: File[];
}

export const grievanceService = {
  submitGrievance: async (payload: GrievancePayload) => {
    console.log('[API MOCK] Submitting grievance payload:', payload);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock success response
    return {
      success: true,
      grid_id: `GRV-${Math.floor(Math.random() * 100000)}`,
      status: 'INTERCEPTED',
      message: 'Grievance successfully routed to regional node.'
    };
  },

  getAllGrievances: async () => {
    console.log('[API MOCK] Fetching all grievances');
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 'GRV-88219', status: 'RESOLVED', category: 'SANITATION', description: 'Systemic waste overflow in sector 4. Logic node cleanup requested.', date: '2024-10-12T08:30:00Z' },
      { id: 'GRV-88220', status: 'IN_PROGRESS', category: 'TRAFFIC', description: 'Neural routing delay at block 12 interaction. Congestion metrics peaking.', date: '2024-10-12T09:15:00Z' },
      { id: 'GRV-88221', status: 'INTERCEPTED', category: 'WATER', description: 'Pipeline telemetry showing zero pressure in central node uplink.', date: '2024-10-12T10:05:00Z' }
    ];
  }
};
