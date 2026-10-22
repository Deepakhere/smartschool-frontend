import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { useAreaBase, useCan, useCurrentRole } from "@/context/tenant-context";
import { PermissionKey } from "@/types";

export const SETTINGS_TABS: { path: string; label?: string; labelKey?: string; anyOf?: PermissionKey[]; adminOnly?: boolean }[] = [
  { path: "profile", labelKey: "labels.profile" },
  { path: "add-user", labelKey: "labels.user_management", anyOf: ["people.manage"] },
  { path: "roles", label: "Roles", adminOnly: true },
  { path: "notifications", labelKey: "labels.notifications", anyOf: ["school.settings"] },
  { path: "online-payments", label: "Online payments", anyOf: ["fees.setup"] },
];

const useUserManagementController = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const areaBase = useAreaBase();
  const can = useCan();
  const isAdmin = useCurrentRole() === "admin";

  const tabs = SETTINGS_TABS.filter((tab) => (tab.adminOnly ? isAdmin : !tab.anyOf || can(...tab.anyOf)));
  const activePath = tabs.find((tab) => location.pathname.includes(`/settings/${tab.path}`))?.path;

  useEffect(() => {
    if (!activePath) navigate(`${areaBase}/settings/${tabs[0].path}`, { replace: true });
  }, [activePath, navigate, areaBase, tabs]);

  const handleTabChange = (path: string) => {
    if (path !== activePath) navigate(`${areaBase}/settings/${path}`);
  };

  const tabLabel = (tab: (typeof SETTINGS_TABS)[number]) => (tab.labelKey ? t(tab.labelKey) : tab.label);

  return { tabs, activePath: activePath ?? "profile", handleTabChange, tabLabel };
};

export default useUserManagementController;
