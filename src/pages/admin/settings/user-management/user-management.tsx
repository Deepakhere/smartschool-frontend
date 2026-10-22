import { Outlet } from "react-router-dom";

import SectionHeader from "@/components/section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUserManagementController from "./user-management-controller";

const UserManagement = () => {
  const { tabs, activePath, handleTabChange, tabLabel } = useUserManagementController();

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Settings" description="Your profile, the school's people, their roles and access" />

      <div className="mb-4">
        <Tabs value={activePath} onValueChange={handleTabChange}>
          <TabsList>
            {tabs.map((tab) => (
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
