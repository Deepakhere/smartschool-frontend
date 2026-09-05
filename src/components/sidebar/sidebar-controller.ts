import { useParams, useLocation } from "react-router-dom";

import {
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  UserIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/auth-context";

export const useSidebarController = () => {
  const { organizationId } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const adminSections = [
    {
      items: [{ name: "Dashboard", href: `/${organizationId}/admin/dashboard`, icon: HomeIcon, current: isActive("/dashboard") }],
    },
    {
      label: "Academics",
      items: [
        { name: "Classes", href: `/${organizationId}/admin/classes`, icon: AcademicCapIcon, current: isActive("/classes") },
        { name: "Students", href: `/${organizationId}/admin/students`, icon: UserGroupIcon, current: isActive("/students") },
        { name: "Teachers", href: `/${organizationId}/admin/teachers`, icon: UserIcon, current: isActive("/teachers") },
        { name: "Attendance", href: `/${organizationId}/admin/attendance`, icon: ClipboardDocumentCheckIcon, current: isActive("/attendance") },
        { name: "Homework", href: `/${organizationId}/admin/homework`, icon: BookOpenIcon, current: isActive("/homework") },
      ],
    },
    {
      label: "Engagement",
      items: [
        { name: "Notices", href: `/${organizationId}/admin/notices`, icon: ClipboardDocumentListIcon, current: isActive("/notices") },
        { name: "PTM", href: `/${organizationId}/admin/ptm`, icon: UsersIcon, current: isActive("/ptm") },
      ],
    },
    {
      label: "Finance & Results",
      items: [
        { name: "Fees", href: `/${organizationId}/admin/fees`, icon: CurrencyDollarIcon, current: isActive("/fees") },
        { name: "Results", href: `/${organizationId}/admin/results`, icon: ChartBarIcon, current: isActive("/results") },
      ],
    },
    {
      items: [{ name: "Settings", href: `/${organizationId}/admin/settings`, icon: Cog6ToothIcon, current: isActive("/settings") }],
    },
  ];

  const parentSections = [
    {
      items: [{ name: "Dashboard", href: `/${organizationId}/parent/dashboard`, icon: HomeIcon, current: isActive("/dashboard") }],
    },
    {
      label: "School Life",
      items: [
        { name: "Notices", href: `/${organizationId}/parent/notices`, icon: ClipboardDocumentListIcon, current: isActive("/notices") },
        { name: "Homework", href: `/${organizationId}/parent/homework`, icon: ClipboardDocumentCheckIcon, current: isActive("/homework") },
        { name: "PTM", href: `/${organizationId}/parent/ptm`, icon: UsersIcon, current: isActive("/ptm") },
      ],
    },
    {
      label: "Finance & Results",
      items: [
        { name: "Fees", href: `/${organizationId}/parent/fees`, icon: CurrencyDollarIcon, current: isActive("/fees") },
        { name: "Results", href: `/${organizationId}/parent/reports`, icon: ChartBarIcon, current: isActive("/reports") },
      ],
    },
  ];

  const teacherSections = [
    {
      items: [{ name: "Dashboard", href: `/${organizationId}/teacher/dashboard`, icon: HomeIcon, current: isActive("/dashboard") }],
    },
    {
      label: "Classroom",
      items: [
        { name: "Attendance", href: `/${organizationId}/teacher/attendance`, icon: ClipboardDocumentCheckIcon, current: isActive("/attendance") },
        { name: "Homework", href: `/${organizationId}/teacher/homework`, icon: BookOpenIcon, current: isActive("/homework") },
        { name: "PTM", href: `/${organizationId}/teacher/ptm`, icon: UsersIcon, current: isActive("/ptm") },
      ],
    },
  ];

  const sections =
    user?.role === "teacher" ? teacherSections : user?.role === "parent" ? parentSections : adminSections;

  return {
    sections,
  };
};
