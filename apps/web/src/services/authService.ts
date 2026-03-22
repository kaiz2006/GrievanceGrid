// Mock Authentication Service

export const authService = {
  login: async (credentials: any) => {
    console.log('[API MOCK] Attempting login with:', credentials);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (credentials.email === 'admin@grievancegrid.gov') {
      return { success: true, token: 'mock-jwt-token-admin', role: 'ADMIN' };
    }
    
    return { success: true, token: 'mock-jwt-token-citizen', role: 'CITIZEN' };
  },

  register: async (data: any) => {
    console.log('[API MOCK] Attempting registration with:', data);
    await new Promise(resolve => setTimeout(resolve, 800));

    if (data.email && data.email.includes('admin@grievancegrid.gov')) {
      return { success: true, token: 'mock-jwt-token-admin', role: 'ADMIN' };
    }
    
    return { success: true, token: 'mock-jwt-token-citizen', role: 'CITIZEN' };
  },

  logout: async () => {
    console.log('[API MOCK] Logging out...');
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }
};
