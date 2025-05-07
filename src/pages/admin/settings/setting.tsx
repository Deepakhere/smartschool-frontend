import { useLocation, Routes, Route, Link, Navigate } from "react-router-dom";
import AdminProfile from "../profile/profile";
import AddUser from "../add-user/add-user";

const Settings = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="">
          {/* Tabs navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <Link
                to="/admin/settings/profile"
                className={`${
                  path.includes("/settings/profile")
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Profile
              </Link>
              <Link
                to="/admin/settings/add-user"
                className={`${
                  path.includes("/settings/add-user")
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                User Management
              </Link>
            </nav>
          </div>

          {/* Nested routes content */}
          <Routes>
            <Route path="/" element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="add-user" element={<AddUser />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Settings;
