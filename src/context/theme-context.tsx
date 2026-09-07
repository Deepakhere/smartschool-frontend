import { createContext, useContext, useEffect, ReactNode } from "react";

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
  const { user, updatePreferences } = useAuth();
  const updateServerPreferences = useUpdateUserPreferences();

  // no local state to keep in sync: once logged in, the server preference is the
  // value; before that (or as an offline fallback), localStorage is read directly —
  // it never changes except through setTheme below, so there's nothing to watch
  const theme: ThemeType = user?.preferences?.theme || (localStorage.getItem("theme") as ThemeType) || "light";

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = (next: ThemeType) => {
    updatePreferences({ theme: next });
    if (user) updateServerPreferences.mutate({ theme: next });
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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
