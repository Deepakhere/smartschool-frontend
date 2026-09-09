import { useParams } from "react-router-dom";

import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";

export const useSidebarUserMenuController = () => {
  const { organizationId } = useParams();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // admin's own profile lives inside the tabbed Settings area; teacher/parent get a direct page
  const profilePath =
    user?.role === "admin"
      ? `/${organizationId}/admin/settings`
      : `/${organizationId}/${user?.role}/profile`;

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user,
    theme,
    setTheme,
    profilePath,
    isPlatformAdmin: !!user?.isPlatformAdmin,
    handleLogout,
  };
};
