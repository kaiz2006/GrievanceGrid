// Auth Service for GrievanceGrid
// Following API SPEC Section - Authentication
import { apiClient, mockDelay } from "./api.client";
import { UserRole } from "@/types";
import { auth, signOut } from "@/lib/firebase";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

const mockUser: User = {
  id: "user_123",
  email: "major.tom@groundcontrol.gov",
  name: "Major Tom",
  role: "CITIZEN",
};

const persistTokens = (accessToken?: string, refreshToken?: string): void => {
  if (accessToken) {
    localStorage.setItem("auth_token", accessToken);
  }
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }
};

export const authService = {
  // POST /auth/login - Login with email/password
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password }, async () => {
      await mockDelay(1000);
      return {
        access_token: 'mock_jwt_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
        token_type: 'bearer',
        expires_in: 86400,
        user: { ...mockUser, email },
      };
    });
    persistTokens(response.access_token, response.refresh_token);
    return response;
  },

  // POST /auth/register - Register new user
  register: async (data: { email: string; password: string; name: string; phone?: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', { ...data }, async () => {
      await mockDelay(1200);
      return {
        access_token: 'mock_jwt_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
        token_type: 'bearer',
        expires_in: 86400,
        user: { ...mockUser, email: data.email, name: data.name, phone: data.phone },
      };
    });
    persistTokens(response.access_token, response.refresh_token);
    return response;
  },

  // GET /auth/me - Get current user
  me: async (): Promise<User> => {
    return apiClient.get("/auth/me", async () => {
      await mockDelay(200);
      const email = localStorage.getItem("userEmail") || mockUser.email;
      const name = localStorage.getItem("userName") || mockUser.name;
      const role = (localStorage.getItem("userRole") as UserRole) || mockUser.role;
      const id = localStorage.getItem("userUid") || mockUser.id;
      const avatar_url = localStorage.getItem("userPhoto") || undefined;
      return { id, email, name, role, avatar_url };
    });
  },

  // POST /auth/logout - Logout user
  logout: async (): Promise<{ success: boolean }> => {
    const response = await apiClient.post("/auth/logout", {}, async () => {
      await mockDelay(300);
      return { success: true };
    });
    // Clear token on logout
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userUid");
    localStorage.removeItem("userPhoto");
    
    // Sign out from Firebase
    try {
      if (auth) await signOut(auth);
    } catch(e) {
      console.error("Firebase signout error", e);
    }
    return response;
  },

  // POST /auth/google - Google OAuth login
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google', { id_token: idToken }, async () => {
      await mockDelay(800);
      return {
        access_token: 'mock_google_jwt_' + Date.now(),
        refresh_token: 'mock_google_refresh_' + Date.now(),
        token_type: 'bearer',
        expires_in: 86400,
        user: { ...mockUser, email: 'google.user@gmail.com', name: 'Google User' },
      };
    });
    persistTokens(response.access_token, response.refresh_token);
    return response;
  },

  // POST /auth/refresh - Refresh JWT token
  refreshToken: async (): Promise<{ access_token: string; refresh_token: string; expires_in: number }> => {
    const response = await apiClient.post<{ access_token: string; refresh_token: string; expires_in: number }>('/auth/refresh', { refresh_token: localStorage.getItem('refresh_token') }, async () => {
      await mockDelay(200);
      return {
        access_token: 'mock_refreshed_jwt_' + Date.now(),
        refresh_token: 'mock_refreshed_refresh_' + Date.now(),
        expires_in: 86400,
      };
    });
    persistTokens(response.access_token, response.refresh_token);
    return response;
  },

  // PUT /auth/profile - Update user profile
  updateProfile: async (data: { name?: string; phone?: string; avatar_url?: string }): Promise<User> => {
    return apiClient.put("/auth/profile", data, async () => {
      await mockDelay(400);
      return { ...mockUser, ...data };
    });
  }
};
