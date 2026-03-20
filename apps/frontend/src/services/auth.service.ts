// Mock Auth Service for GrievanceGrid
// Following API SPEC Section 4
import { UserRole } from "@/types";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const mockUser: User = {
  id: "user_123",
  email: "major.tom@groundcontrol.gov",
  name: "Major Tom",
  role: "CITIZEN",
};

export const authService = {
  login: async (email: string, password: string) => {
    console.log(`[API CALL]: POST /auth/login { email: "${email}" }`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { token: "mock_jwt_token", user: mockUser };
  },

  register: async (data: any) => {
    console.log(`[API CALL]: POST /auth/register`, data);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return { token: "mock_jwt_token", user: { ...mockUser, email: data.email, name: data.name } };
  },

  me: async () => {
    console.log(`[API CALL]: GET /auth/me`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUser;
  },

  logout: async () => {
    console.log(`[API CALL]: POST /auth/logout`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
};
