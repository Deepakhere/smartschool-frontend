import React from "react";
import Cookies from "js-cookie";
import { USER_ACCESS_KEY } from "../utils";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "admin" | "parent";
}

const useRoutesController = () => {
  const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const token = Cookies.get(USER_ACCESS_KEY.TOKEN);
    const user_role = Cookies.get(USER_ACCESS_KEY.ROLE);

    if (token && user_role) {
      return <Navigate to={`/${user_role}/dashboard`} replace />;
    }

    return <>{children}</>;
  };

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    role,
  }) => {
    const token = Cookies.get(USER_ACCESS_KEY.TOKEN);
    const user_role = Cookies.get(USER_ACCESS_KEY.ROLE);

    if (!token || user_role !== role) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  return {
    PublicRoute,
    ProtectedRoute,
  };
};

export default useRoutesController;
