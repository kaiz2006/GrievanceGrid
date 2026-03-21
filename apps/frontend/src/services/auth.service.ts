// Auth Service for GrievanceGrid
// Following API SPEC Section - Authentication
import { apiClient, mockDelay } from "./api.client";
import { UserRole } from "@/types";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expires_at: string;
}

const mockUser: User = {
  id: "user_123",
  email: "major.tom@groundcontrol.gov",
  name: "Major Tom",
  role: "CITIZEN",
};

export const authService = {
  // POST /auth/login - Login with email/password
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", { email, password }, async () => {
      await mockDelay(1000);
      return {
        token: "mock_jwt_token_" + Date.now(),
        user: { ...mockUser, email },
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    });
    // Store token for subsequent requests
    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }
    return response;
  },

  // POST /auth/register - Register new user
  register: async (data: { email: string; password: string; name: string; phone?: string }): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", { ...data }, async () => {
      await mockDelay(1200);
      return {
        token: "mock_jwt_token_" + Date.now(),
        user: { ...mockUser, email: data.email, name: data.name, phone: data.phone },
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    });
    // Store token for subsequent requests
    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }
    return response;
  },

  // GET /auth/me - Get current user
  me: async (): Promise<User> => {
    return apiClient.get("/auth/me", async () => {
      await mockDelay(500);
      return mockUser;
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
    return response;
  },

  // POST /auth/google - Google OAuth login
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    return apiClient.post("/auth/google", { id_token: idToken }, async () => {
      await mockDelay(800);
      return {
        token: "mock_google_jwt_" + Date.now(),
        user: { ...mockUser, email: "google.user@gmail.com", name: "Google User" },
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    });
  },

  // POST /auth/refresh - Refresh JWT token
  refreshToken: async (): Promise<{ token: string; expires_at: string }> => {
    return apiClient.post("/auth/refresh", {}, async () => {
      await mockDelay(200);
      return {
        token: "mock_refreshed_jwt_" + Date.now(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    });
  },

  // PUT /auth/profile - Update user profile
  updateProfile: async (data: { name?: string; phone?: string; avatar_url?: string }): Promise<User> => {
    return apiClient.put("/auth/profile", data, async () => {
      await mockDelay(400);
      return { ...mockUser, ...data };
    });
  }
};
