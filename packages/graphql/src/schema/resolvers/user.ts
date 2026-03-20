import { apiRequest, type GraphQLContext } from "./http.js";

type RawUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  department_id?: string | null;
  is_active: boolean;
  created_at: string;
};

type RawTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: RawUser;
};

function mapUser(user: RawUser): Record<string, unknown> {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    departmentId: user.department_id ?? null,
    isActive: user.is_active,
    createdAt: user.created_at,
  };
}

function mapToken(payload: RawTokenResponse): Record<string, unknown> {
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    tokenType: payload.token_type,
    expiresIn: payload.expires_in,
    user: mapUser(payload.user),
  };
}

export const userResolvers = {
  Query: {
    async me(_: unknown, __: unknown, ctx: GraphQLContext): Promise<Record<string, unknown>> {
      const payload = await apiRequest<RawUser>("/auth/me", { method: "GET" }, ctx);
      return mapUser(payload);
    },
  },

  Mutation: {
    async register(
      _: unknown,
      args: { email: string; password: string },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      const payload = await apiRequest<RawTokenResponse>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ email: args.email, password: args.password }),
        },
        ctx
      );
      return mapToken(payload);
    },

    async login(
      _: unknown,
      args: { email: string; password: string },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      const payload = await apiRequest<RawTokenResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email: args.email, password: args.password }),
        },
        ctx
      );
      return mapToken(payload);
    },

    async googleAuth(
      _: unknown,
      args: { idToken: string },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      const payload = await apiRequest<RawTokenResponse>(
        "/auth/google",
        {
          method: "POST",
          body: JSON.stringify({ id_token: args.idToken }),
        },
        ctx
      );
      return mapToken(payload);
    },

    async refreshToken(
      _: unknown,
      args: { refreshToken: string },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      const payload = await apiRequest<RawTokenResponse>(
        "/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ refresh_token: args.refreshToken }),
        },
        ctx
      );
      return mapToken(payload);
    },

    async changePassword(
      _: unknown,
      args: { currentPassword: string; newPassword: string; confirmPassword: string },
      ctx: GraphQLContext
    ): Promise<Record<string, unknown>> {
      return apiRequest<Record<string, unknown>>(
        "/auth/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            current_password: args.currentPassword,
            new_password: args.newPassword,
            confirm_password: args.confirmPassword,
          }),
        },
        ctx
      );
    },

    async logout(_: unknown, __: unknown, ctx: GraphQLContext): Promise<Record<string, unknown>> {
      return apiRequest<Record<string, unknown>>(
        "/auth/logout",
        {
          method: "POST",
          body: JSON.stringify({}),
        },
        ctx
      );
    },
  },
};
