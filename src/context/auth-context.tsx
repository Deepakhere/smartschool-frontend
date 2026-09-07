import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { useGetUserDetails } from "./service";
import { APIS_ROUTES, USER_ACCESS_KEY } from "../utils";
import { ILoginResponse } from "../types";
import LogoSpinner from "../components/logo-spinner";
import apiClient from "../config/api-client";

type User = {
  name?: string;
  id?: string;
  email?: string;
  role?: "admin" | "parent" | "teacher";
  phoneNumber?: string;
  isPlatformAdmin?: boolean;
  permissions?: {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    isGlobalAdmin: boolean;
  };
} | null;

interface IAuthContext {
  login: (data: ILoginResponse) => void;
  logout: () => void;
  user: User;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const getUserDetails = useGetUserDetails();

  const login = (data: ILoginResponse) => {
    Cookies.set(USER_ACCESS_KEY.TOKEN, data.token);
    if (data.refreshToken) {
      Cookies.set(USER_ACCESS_KEY.REFRESH_TOKEN, data.refreshToken);
    }
    Cookies.set(USER_ACCESS_KEY.ROLE, data.role);
    setUser(data);
  };

  const logout = () => {
    // best-effort session revocation — clear local cookies regardless of outcome
    apiClient.post(APIS_ROUTES.LOGOUT).catch(() => {});
    Cookies.remove(USER_ACCESS_KEY.TOKEN);
    Cookies.remove(USER_ACCESS_KEY.REFRESH_TOKEN);
    Cookies.remove(USER_ACCESS_KEY.ROLE);
    window.location.href = "/login";
  };

  useEffect(() => {
    if (Cookies.get(USER_ACCESS_KEY.TOKEN)) {
      if (getUserDetails.isSuccess && getUserDetails.data) {
        if (getUserDetails.data.role !== Cookies.get(USER_ACCESS_KEY.ROLE)) {
          Cookies.remove(USER_ACCESS_KEY.TOKEN);
          Cookies.remove(USER_ACCESS_KEY.REFRESH_TOKEN);
          Cookies.remove(USER_ACCESS_KEY.ROLE);
          window.location.href = "/login";
        } else {
          setUser(getUserDetails.data);
        }
      }
    }
  }, [getUserDetails.isSuccess, getUserDetails.data]);

  useEffect(() => {
    if (getUserDetails.isError) {
      if (Cookies.get(USER_ACCESS_KEY.TOKEN)) {
        Cookies.remove(USER_ACCESS_KEY.TOKEN);
        Cookies.remove(USER_ACCESS_KEY.REFRESH_TOKEN);
        Cookies.remove(USER_ACCESS_KEY.ROLE);
        setUser(null);
      }
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/forgot-password")
      ) {
        window.location.href = "/login";
      }
    }
  }, [getUserDetails.isError]);

  // a token cookie exists but we haven't yet confirmed it's still valid (page load / hard refresh) —
  // this is the ONLY place the full-page logo loader should show; every other loading state
  // in the app is a normal in-page spinner, not this one
  const isCheckingSession = !!Cookies.get(USER_ACCESS_KEY.TOKEN) && getUserDetails.isLoading;

  if (isCheckingSession) {
    return <LogoSpinner />;
  }

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
