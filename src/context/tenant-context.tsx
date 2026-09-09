import { createContext, useContext, ReactNode } from "react";
import { useParams, Navigate } from "react-router-dom";

import { useAuth } from "./auth-context";
import useGetAllOrganizations from "../pages/auth/service/get-all-organization/get-all-organization";
import LogoSpinner from "../components/logo-spinner";
import { IOrganization } from "../types";

interface ITenantContext {
  organizationId: string;
  organization: IOrganization | undefined;
  organizations: IOrganization[];
}

const TenantContext = createContext<ITenantContext | undefined>(undefined);

// mounted by ProtectedRoute; confirms the route's :organizationId is one the user actually belongs to
export const TenantProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <TenantContext.Provider value={{ organizationId, organization, organizations }}>{children}</TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
