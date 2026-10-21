import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// the Settings tabs, in order; each is a route under /settings
export const SETTINGS_TABS = [
  { path: "profile", labelKey: "labels.profile" },
  { path: "add-user", labelKey: "labels.user_management" },
  { path: "notifications", labelKey: "labels.notifications" },
  { path: "online-payments", label: "Online payments" },
] as const;

const useUserManagementController = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { organizationId } = useParams<{ organizationId: string }>();

  const activePath = SETTINGS_TABS.find((tab) => location.pathname.includes(`/settings/${tab.path}`))?.path;

  // an unknown or bare /settings address opens the first tab
  useEffect(() => {
    if (!activePath) navigate(`/${organizationId}/admin/settings/profile`, { replace: true });
  }, [activePath, navigate, organizationId]);

  const handleTabChange = (path: string) => {
    if (path !== activePath) navigate(`/${organizationId}/admin/settings/${path}`);
  };

  const tabLabel = (tab: (typeof SETTINGS_TABS)[number]) => ("labelKey" in tab ? t(tab.labelKey) : tab.label);

  return { activePath: activePath ?? "profile", handleTabChange, tabLabel };
};

export default useUserManagementController;
