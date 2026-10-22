import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/auth-context";
import { TenantProvider } from "../context/tenant-context";
import useIsMobile from "../hooks/is-mobile/is-mobile";
import MobileNotice from "../components/mobile-notice";
import { UserRole } from "./access";

interface RouteGuardProps {
  children: ReactNode;
}

interface ProtectedRouteProps extends RouteGuardProps {
  role: UserRole;
}

// Access policy, applied the same way everywhere:
//   signed out                -> /login
//   signed in, wrong role     -> /not-access (a 403, not a silent redirect)
//   signed in, right role     -> page (the backend still enforces every request)
// The user comes from AuthProvider, which has already verified the session with the server.

// signed-in visitors skip public pages (login and the like); the school picker opens their school in their role there
export const PublicRoute = ({ children }: RouteGuardProps) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/organization" replace />;
  }

  return <>{children}</>;
};

// any signed-in role (organization picker)
export const AuthenticatedRoute = ({ children }: RouteGuardProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) return <Navigate to="/login" replace />;

  // the signed-in app is not responsive yet, so phones get a notice for now
  if (isMobile) return <MobileNotice />;

  // the role is per school, so TenantProvider checks it once it knows which school the URL is for
  return <TenantProvider requiredRole={role}>{children}</TenantProvider>;
};

// unknown URLs: a signed-out visitor should land on login, not an "access denied" page
export const FallbackRoute = () => {
  const { user } = useAuth();

  return <Navigate to={user ? "/not-access" : "/login"} replace />;
};
