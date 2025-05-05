import { createBrowserRouter, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
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
import { USER_ACCESS_KEY } from "../utils";

// Protected Route Component
const ProtectedRoute = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "parent";
}) => {
  const token = Cookies.get(USER_ACCESS_KEY.TOKEN);
  const user_role = Cookies.get(USER_ACCESS_KEY.ROLE);

  if (!token || user_role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = Cookies.get(USER_ACCESS_KEY.TOKEN);
  const user_role = Cookies.get(USER_ACCESS_KEY.ROLE);

  if (token && user_role) {
    return <Navigate to={`/${user_role}`} replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
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
