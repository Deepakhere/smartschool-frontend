import { Routes, Route, Navigate } from "react-router-dom";

import UserManagement from "./user-management";
import AdminProfile from "./profile";
import UserDetails from "./user-details";

const Settings = () => {
  return (
    <Routes>
      <Route path="/" element={<UserManagement />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="add-user" element={<UserDetails />} />
      </Route>
    </Routes>
  );
};

export default Settings;
