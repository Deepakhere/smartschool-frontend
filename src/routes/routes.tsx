import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../components/layout/layout";

// Admin Pages
import AdminDashboard from "../pages/admin/dashboard";
import AdminNotices from "../pages/admin/notices";
import AdminHomework from "../pages/admin/homework";
import AdminReports from "../pages/admin/reports";
import AdminFees from "../pages/admin/fees";
import AdminStudents from "../pages/admin/students";
import AdminAddUser from "../pages/admin/add-user";

// Parent Pages
import ParentDashboard from "../pages/parent/dashboard";
import ParentNotices from "../pages/parent/notices";
import ParentHomework from "../pages/parent/homework";
import ParentReports from "../pages/parent/reports";
import ParentFees from "../pages/parent/fees";

// Auth Pages
import Login from "../pages/auth/login";
import ForgotPassword from "../pages/auth/forgot-password";
import useRoutesController from "./routes-controller";
import AdminSettings from "../pages/admin/settings";
import AdminProfile from "../pages/admin/profile";

const Routes = () => {
  const { PublicRoute, ProtectedRoute } = useRoutesController();

  return createBrowserRouter([
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      ),
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute role="admin">
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "notices",
          element: <AdminNotices />,
        },
        {
          path: "homework",
          element: <AdminHomework />,
        },
        {
          path: "reports",
          element: <AdminReports />,
        },
        {
          path: "fees",
          element: <AdminFees />,
        },
        {
          path: "students",
          element: <AdminStudents />,
        },
        {
          path: "add-user",
          element: <AdminAddUser />,
        },
        {
          path: "settings",
          element: <AdminSettings />,
        },
        {
          path: "profile",
          element: <AdminProfile />,
        },
      ],
    },
    {
      path: "/parent",
      element: (
        <ProtectedRoute role="parent">
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <ParentDashboard />,
        },
        {
          path: "notices",
          element: <ParentNotices />,
        },
        {
          path: "homework",
          element: <ParentHomework />,
        },
        {
          path: "reports",
          element: <ParentReports />,
        },
        {
          path: "fees",
          element: <ParentFees />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);
};

export default Routes;
