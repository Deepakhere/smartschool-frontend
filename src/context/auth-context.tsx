import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";

interface IAuthContext {
  isAuthenticated: boolean;
  userRole: "admin" | "parent" | null;
  login: (token: string, role: "admin" | "parent") => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "parent" | null>(null);

  const login = (token: string, role: "admin" | "parent") => {
    Cookies.set("token", token);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
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
