import { createContext, useContext, ReactNode } from "react";
import { useParams, Navigate } from "react-router-dom";

import { useAuth } from "./auth-context";
import useGetAllOrganizations from "../pages/auth/service/get-all-organization/get-all-organization";
import LogoSpinner from "../components/logo-spinner";
import { IOrganization } from "../types";
import { homePathFor, UserRole } from "../routes/access";

interface ITenantContext {
  organizationId: string;
  organization: IOrganization | undefined;
  organizations: IOrganization[];
  // the signed-in person's role in this school
  role: UserRole | undefined;
}

const TenantContext = createContext<ITenantContext | undefined>(undefined);

// Mounted by ProtectedRoute. Confirms the route's :organizationId is one the user belongs to, and that the area of
// the app (admin, teacher, parent) matches their role in that school; one person can be a teacher in one school and a
// parent in another. Someone in the wrong area is sent to their own area of that school.
export const TenantProvider = ({ children, requiredRole }: { children: ReactNode; requiredRole?: UserRole }) => {
  const { organizationId = "" } = useParams<{ organizationId: string }>();
  const { user } = useAuth();
  const getAllOrganizations = useGetAllOrganizations();

  if (getAllOrganizations.isLoading) {
    return <LogoSpinner />;
  }

  const organizations = getAllOrganizations.data?.items || [];
  const organization = organizations.find((o) => o.id === organizationId);

  // platform admins can access any tenant; resolveTenant() enforces that on the backend
  const isValidTenant = !!organization || !!user?.isPlatformAdmin;

  if (!isValidTenant) {
    return <Navigate to="/not-access" replace />;
  }

  const role = organization?.myRole as UserRole | undefined;
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role ? homePathFor(organizationId, role) : "/not-access"} replace />;
  }

  return (
    <TenantContext.Provider value={{ organizationId, organization, organizations, role }}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

// the signed-in person's role in the current school
export const useCurrentRole = (): UserRole | undefined => useContext(TenantContext)?.role;
