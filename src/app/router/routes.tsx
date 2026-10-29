import { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "@/app/layout/layout";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminNotices from "@/pages/admin/notices";
import AdminHomework from "@/pages/admin/homework";
import AdminReports from "@/pages/admin/reports";
import AdminFees from "@/pages/admin/fees";
import AdminStudents from "@/pages/admin/students";
import StudentForm from "@/pages/admin/students/student-form";
import { PermissionGate } from "@/entities/session";
import AdminClasses from "@/pages/admin/classes";
import AdminTeachers from "@/pages/admin/teachers";
import AdminAttendance from "@/pages/admin/attendance";
import AdminSettings from "@/pages/admin/settings";
import AdminPTM from "@/pages/admin/ptm";
import AdminCalendar from "@/pages/admin/calendar";
import Timetable from "@/pages/admin/timetable";
import AdminLeaveRequests from "@/pages/admin/leave-requests";
import AdminPromotion from "@/pages/admin/promotion";
import AdminCertificates from "@/pages/admin/certificates";

import TeacherDashboard from "@/pages/teacher/dashboard";
import TeacherPTM from "@/pages/teacher/ptm";
import TeacherMarks from "@/pages/teacher/marks";

import ParentDashboard from "@/pages/parent/dashboard";
import ParentNotices from "@/pages/parent/notices";
import ParentHomework from "@/pages/parent/homework";
import ParentAttendance from "@/pages/parent/attendance";
import ParentReports from "@/pages/parent/reports";
import ParentFees from "@/pages/parent/fees";
import ParentPTM from "@/pages/parent/ptm";
import ParentLeaveRequests from "@/pages/parent/leave-requests";

// same profile page for every role, mounted under each role's own path
import Profile from "@/pages/admin/settings/profile";

import Login from "@/pages/auth/login";
import ForgotPassword from "@/pages/auth/forgot-password";
import SetPassword from "@/pages/auth/set-password";
import ResetPassword from "@/pages/auth/reset-password";
import NotAccess from "@/shared/ui/not-access";
import { AuthenticatedRoute, FallbackRoute, ProtectedRoute, PublicRoute } from "./route-guards";
import { sharedRoutes } from "./shared-pages";
import { FirstPermittedPage } from "@/entities/session";
import { ModuleGate } from "@/widgets/module-gate";
import { ModuleKey } from "@/shared/types";
import SupportList from "@/pages/support/support-list";
import SupportThread from "@/pages/support/support-thread";
import Organization from "@/pages/auth/organization";

// a module the school's package leaves out opens read-only for staff
const gate = (module: ModuleKey, element: ReactNode) => <ModuleGate module={module}>{element}</ModuleGate>;

// built once at module load: re-creating the router on a re-render would reset navigation state
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Navigate to="/login" replace />
      </PublicRoute>
    ),
  },
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
    path: "/organization",
    element: (
      <AuthenticatedRoute>
        <Organization />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/set-password",
    element: <SetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/not-access",
    element: <NotAccess />,
  },
  {
    path: "/:organizationId/admin",
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
        element: gate("notices", <AdminNotices />),
      },
      {
        path: "homework",
        element: gate("homework", <AdminHomework />),
      },
      {
        path: "results/*",
        element: gate("exams", <AdminReports />),
      },
      {
        path: "fees",
        element: gate("fees", <AdminFees />),
      },
      {
        path: "students/*",
        element: <AdminStudents />,
      },
      {
        path: "admissions",
        element: (
          <PermissionGate anyOf={["students.manage"]}>
            <StudentForm />
          </PermissionGate>
        ),
      },
      {
        path: "classes",
        element: <AdminClasses />,
      },
      {
        path: "teachers",
        element: <AdminTeachers />,
      },
      {
        path: "attendance",
        element: gate("attendance", <AdminAttendance />),
      },
      {
        path: "ptm",
        element: gate("ptm", <AdminPTM />),
      },
      {
        path: "calendar",
        element: gate("calendar", <AdminCalendar />),
      },
      {
        path: "timetable",
        element: gate("timetable", <Timetable />),
      },
      {
        path: "leave-requests",
        element: gate("leave", <AdminLeaveRequests />),
      },
      {
        path: "promotion",
        element: <AdminPromotion />,
      },
      {
        path: "certificates/*",
        element: gate("certificates", <AdminCertificates />),
      },
      {
        path: "settings/*",
        element: <AdminSettings />,
      },
      { path: "support", element: <SupportList /> },
      { path: "support/:requestId", element: <SupportThread /> },
    ],
  },
  {
    path: "/:organizationId/teacher",
    element: (
      <ProtectedRoute role="teacher">
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
        element: <TeacherDashboard />,
      },
      {
        path: "attendance",
        element: gate("attendance", <AdminAttendance />),
      },
      {
        path: "homework",
        element: gate("homework", <AdminHomework />),
      },
      {
        path: "ptm",
        element: gate("ptm", <TeacherPTM />),
      },
      {
        path: "marks",
        element: gate("exams", <TeacherMarks />),
      },
      {
        path: "timetable",
        element: gate("timetable", <Timetable />),
      },
      {
        path: "calendar",
        element: gate("calendar", <AdminCalendar />),
      },
      {
        path: "leave-requests",
        element: gate("leave", <AdminLeaveRequests />),
      },
      {
        path: "profile",
        element: <Profile />,
      },
      { path: "support", element: <SupportList /> },
      { path: "support/:requestId", element: <SupportThread /> },
      ...sharedRoutes(),
    ],
  },
  ...(["accountant", "staff"] as const).map((role) => ({
    path: `/:organizationId/${role}`,
    element: (
      <ProtectedRoute role={role}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <FirstPermittedPage /> },
      { path: "calendar", element: gate("calendar", <AdminCalendar />) },
      { path: "profile", element: <Profile /> },
      { path: "support", element: <SupportList /> },
      { path: "support/:requestId", element: <SupportThread /> },
      ...sharedRoutes(),
    ],
  })),
  {
    path: "/:organizationId/parent",
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
        element: gate("notices", <ParentNotices />),
      },
      {
        path: "homework",
        element: gate("homework", <ParentHomework />),
      },
      {
        path: "attendance",
        element: gate("attendance", <ParentAttendance />),
      },
      {
        path: "reports",
        element: gate("exams", <ParentReports />),
      },
      {
        path: "fees",
        element: gate("fees", <ParentFees />),
      },
      {
        path: "ptm",
        element: gate("ptm", <ParentPTM />),
      },
      {
        path: "calendar",
        element: gate("calendar", <AdminCalendar />),
      },
      {
        path: "leave-requests",
        element: gate("leave", <ParentLeaveRequests />),
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "*",
    element: <FallbackRoute />,
  },
]);

export default router;
