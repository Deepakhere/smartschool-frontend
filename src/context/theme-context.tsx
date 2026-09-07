import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { useAuth } from "./auth-context";
import { useUpdateUserPreferences } from "../pages/admin/settings/profile/service";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const updatePreferences = useUpdateUserPreferences();

  // localStorage is only the pre-auth/offline fallback so there's no flash of the
  // wrong theme before the session check resolves — once logged in, the server's
  // preferences.theme is the source of truth (keeps it consistent across devices)
  const [theme, setThemeState] = useState<ThemeType>(
    () => (localStorage.getItem("theme") as ThemeType) || "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (user?.preferences?.theme && user.preferences.theme !== theme) {
      setThemeState(user.preferences.theme);
    }
    // only react to the server value changing (e.g. on login) — not to our own `theme` state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.preferences?.theme]);

  const applyTheme = (next: ThemeType) => {
    setThemeState(next);
    if (user) {
      updatePreferences.mutate({ theme: next });
    }
  };

  const toggleTheme = () => {
    applyTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
