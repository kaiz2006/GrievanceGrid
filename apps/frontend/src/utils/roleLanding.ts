import type { UserRole } from "@/types";

const ROLE_LANDING_PATHS: Record<UserRole, string> = {
  CITIZEN: "/citizen/dashboard",
  OFFICER: "/officer/dashboard",
  CREW: "/crew/dashboard",
  AUDITOR: "/auditor/dashboard",
  ADMIN: "/admin/dashboard",
};

export const getRoleLandingPath = (role: string | null | undefined): string => {
  const normalizedRole = role?.toUpperCase() as UserRole | undefined;
  if (!normalizedRole || !(normalizedRole in ROLE_LANDING_PATHS)) {
    return ROLE_LANDING_PATHS.CITIZEN;
  }

  return ROLE_LANDING_PATHS[normalizedRole];
};
