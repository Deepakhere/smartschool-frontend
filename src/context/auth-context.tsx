import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { useGetUserDetails } from "./service";
import { USER_ACCESS_KEY } from "../utils";

type User = {
  id?: string;
  email?: string;
  role?: string;
} | null;

interface IAuthContext {
  isAuthenticated: boolean;
  userRole: "admin" | "parent" | null;
  login: (token: string, role: "admin" | "parent") => void;
  logout: () => void;
  user: User;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "parent" | null>(null);
  const [user, setUser] = useState<User>(null);
  const getUserDetails = useGetUserDetails();

  const login = (token: string, role: "admin" | "parent") => {
    Cookies.set(USER_ACCESS_KEY.TOKEN, token);
    Cookies.set(USER_ACCESS_KEY.ROLE, role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    Cookies.remove(USER_ACCESS_KEY.TOKEN);
    Cookies.remove(USER_ACCESS_KEY.ROLE);
    setIsAuthenticated(false);
    setUserRole(null);
  };

  useEffect(() => {
    if (Cookies.get(USER_ACCESS_KEY.TOKEN)) {
      if (getUserDetails.isSuccess && getUserDetails.data) {
        if (getUserDetails.data.role !== Cookies.get(USER_ACCESS_KEY.ROLE)) {
          Cookies.remove(USER_ACCESS_KEY.TOKEN);
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

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, login, logout, user }}
    >
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
