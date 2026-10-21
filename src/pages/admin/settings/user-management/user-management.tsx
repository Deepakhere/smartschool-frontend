import { Outlet } from "react-router-dom";

import SectionHeader from "@/components/section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUserManagementController, { SETTINGS_TABS } from "./user-management-controller";

const UserManagement = () => {
  const { activePath, handleTabChange, tabLabel } = useUserManagementController();

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Settings" description="Manage your profile, school users and their roles" />

      <div className="mb-4">
        <Tabs value={activePath} onValueChange={handleTabChange}>
          <TabsList>
            {SETTINGS_TABS.map((tab) => (
              <TabsTrigger key={tab.path} value={tab.path}>
                {tabLabel(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Outlet />
    </div>
  );
};

export default UserManagement;
