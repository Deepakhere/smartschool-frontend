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

  // admin's own profile lives inside the tabbed Settings area; teacher/parent get a direct page
  const profilePath =
    role === "admin"
      ? `/${organizationId}/admin/settings`
      : `/${organizationId}/${role}/profile`;

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
