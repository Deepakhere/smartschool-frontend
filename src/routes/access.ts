import type { AccountRole } from "@/types";

export type UserRole = AccountRole;

// the one place that knows where each role lands after sign-in; the fee desk opens on fees, not a dashboard
export const homePathFor = (organizationId: string | undefined, role: UserRole) =>
  organizationId ? `/${organizationId}/${role}/${role === "accountant" ? "fees" : "dashboard"}` : "/organization";
