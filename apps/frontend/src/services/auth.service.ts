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
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    persistTokens(response.access_token, response.refresh_token);
    return response;
  },

  // POST /auth/register - Register new user
  register: async (data: { email: string; password: string; name: string; phone?: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', { ...data });
    persistTokens(response.access_token, response.refresh_token);
    return response;
  },

  // GET /auth/me - Get current user
  me: async (): Promise<User> => {
    return apiClient.get("/auth/me");
  },

  // POST /auth/logout - Logout user
  logout: async (): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>("/auth/logout", {});
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
    const response = await apiClient.post<AuthResponse>('/auth/google', { id_token: idToken });
    persistTokens(response.access_token, response.refresh_token);
    return response;
  },

  // POST /auth/refresh - Refresh JWT token
  refreshToken: async (): Promise<{ access_token: string; refresh_token: string; expires_in: number }> => {
    const response = await apiClient.post<{ access_token: string; refresh_token: string; expires_in: number }>('/auth/refresh', { refresh_token: localStorage.getItem('refresh_token') });
    persistTokens(response.access_token, response.refresh_token);
    return response;
  },

  // PUT /auth/profile - Update user profile
  updateProfile: async (data: { name?: string; phone?: string; avatar_url?: string }): Promise<User> => {
    return apiClient.put("/auth/profile", data);
  }
};
