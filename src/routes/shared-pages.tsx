import { ComponentType, ReactNode, SVGProps } from "react";
import PermissionGate from "./permission-gate";
import ModuleGate from "../components/module-gate";
import {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  PresentationChartBarIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import AdminDashboard from "../pages/admin/dashboard";
import AdminClasses from "../pages/admin/classes";
import AdminStudents from "../pages/admin/students";
import AdminPromotion from "../pages/admin/promotion";
import AdminTeachers from "../pages/admin/teachers";
import AdminNotices from "../pages/admin/notices";
import AdminPTM from "../pages/admin/ptm";
import AdminFees from "../pages/admin/fees";
import AdminReports from "../pages/admin/reports";
import AdminSettings from "../pages/admin/settings";
import { ModuleKey, PermissionKey } from "../types";

export interface SharedPage {
  path: string;
  element: ReactNode;
  anyOf: PermissionKey[];
  module?: ModuleKey;
  nav: { name: string; hint: string; icon: ComponentType<SVGProps<SVGSVGElement>> };
}

// admin pages that a permission opens inside any area
export const SHARED_PAGES: SharedPage[] = [
  {
    path: "school-dashboard",
    element: <AdminDashboard />,
    anyOf: ["dashboard.view"],
    nav: { name: "School Dashboard", hint: "The whole school at a glance", icon: PresentationChartBarIcon },
  },
  {
    path: "fees",
    element: <AdminFees />,
    module: "fees",
    anyOf: ["fees.collect", "fees.reports", "fees.setup"],
    nav: { name: "Fees", hint: "Collect fees, receipts and reports", icon: CurrencyDollarIcon },
  },
  {
    path: "classes",
    element: <AdminClasses />,
    anyOf: ["academics.manage"],
    nav: { name: "Classes", hint: "Years, classes, sections and subjects", icon: AcademicCapIcon },
  },
  {
    path: "students/*",
    element: <AdminStudents />,
    anyOf: ["students.view", "students.manage"],
    nav: { name: "Students", hint: "Admissions, profiles and records", icon: UserGroupIcon },
  },
  {
    path: "promotion",
    element: <AdminPromotion />,
    anyOf: ["students.manage"],
    nav: { name: "Promotion", hint: "Move students to the next class", icon: ArrowTrendingUpIcon },
  },
  {
    path: "teachers",
    element: <AdminTeachers />,
    anyOf: ["people.manage"],
    nav: { name: "Teachers", hint: "Staff profiles and roles", icon: UserIcon },
  },
  {
    path: "notices",
    element: <AdminNotices />,
    module: "notices",
    anyOf: ["notices.manage"],
    nav: { name: "Notices", hint: "Announcements to parents and staff", icon: ClipboardDocumentListIcon },
  },
  {
    path: "school-ptm",
    element: <AdminPTM />,
    module: "ptm",
    anyOf: ["ptm.manage"],
    nav: { name: "PTM Events", hint: "Schedule parent-teacher meetings", icon: UsersIcon },
  },
  {
    path: "results",
    element: <AdminReports />,
    module: "exams",
    anyOf: ["exams.manage"],
    nav: { name: "Results", hint: "Exams, marks and report cards", icon: ChartBarIcon },
  },
  {
    path: "settings/*",
    element: <AdminSettings />,
    anyOf: ["people.manage", "school.settings", "fees.setup"],
    nav: { name: "Settings", hint: "People, access and school settings", icon: Cog6ToothIcon },
  },
];

export const sharedRoutes = (except: string[] = []) =>
  SHARED_PAGES.filter((page) => !except.includes(page.path)).map((page) => ({
    path: page.path,
    element: (
      <PermissionGate anyOf={page.anyOf}>
        {page.module ? <ModuleGate module={page.module}>{page.element}</ModuleGate> : page.element}
      </PermissionGate>
    ),
  }));
