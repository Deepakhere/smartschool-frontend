import { useParams } from "react-router-dom";

import { useAuth } from "@/context/auth-context";
import { useCurrentRole } from "@/context/tenant-context";
import { useTheme } from "@/context/theme-context";

export const useSidebarUserMenuController = () => {
  const { organizationId } = useParams();
  const { user, logout } = useAuth();
  // the role in the current school decides the menus and links
  const role = useCurrentRole();
  const { theme, setTheme } = useTheme();

  // an admin's profile lives in Settings
  const profilePath = role === "admin" ? `/${organizationId}/admin/settings` : `/${organizationId}/${role}/profile`;

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user,
    role,
    theme,
    setTheme,
    profilePath,
    isPlatformAdmin: !!user?.isPlatformAdmin,
    handleLogout,
  };
};
