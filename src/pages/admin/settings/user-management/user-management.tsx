import { Tab } from "@headlessui/react";
import useUserManagementController from "./user-management-controller";
import { Outlet } from "react-router-dom";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const UserManagement = () => {
  const { selectedIndex, handleTabChange } = useUserManagementController();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
            <Tab.List className="flex space-x-8 border-b border-gray-200">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none",
                    selected
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )
                }
              >
                Profile
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none",
                    selected
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )
                }
              >
                User Management
              </Tab>
            </Tab.List>
          </Tab.Group>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Outlet />
      </div>
    </>
  );
};

export default UserManagement;
