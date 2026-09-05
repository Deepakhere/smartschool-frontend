import { Tab } from "@headlessui/react";
import { Outlet } from "react-router-dom";

import SectionHeader from "../../../../components/section-header";
import useUserManagementController from "./user-management-controller";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const UserManagement = () => {
  const { t, selectedIndex, handleTabChange } = useUserManagementController();

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Settings" description="Manage your profile, school users and their roles" />

        <div className="mb-4">
          <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
            <Tab.List className="flex space-x-8">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none",
                    selected
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )
                }
              >
                {t("labels.profile")}
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm focus:outline-none",
                    selected
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )
                }
              >
                {t("labels.user_management")}
              </Tab>
            </Tab.List>
          </Tab.Group>
        </div>

        <Outlet />
      </div>
    </>
  );
};

export default UserManagement;
