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
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/auth-context";

export const useSidebarController = () => {
  const { organizationId } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const adminNavigation = [
    { name: "Dashboard", href: `/${organizationId}/admin/dashboard`, icon: HomeIcon, current: isActive("/dashboard") },
    { name: "Classes", href: `/${organizationId}/admin/classes`, icon: AcademicCapIcon, current: isActive("/classes") },
    { name: "Students", href: `/${organizationId}/admin/students`, icon: UserGroupIcon, current: isActive("/students") },
    { name: "Teachers", href: `/${organizationId}/admin/teachers`, icon: UserIcon, current: isActive("/teachers") },
    { name: "Fees", href: `/${organizationId}/admin/fees`, icon: CurrencyDollarIcon, current: isActive("/fees") },
    { name: "Attendance", href: `/${organizationId}/admin/attendance`, icon: ClipboardDocumentCheckIcon, current: isActive("/attendance") },
    { name: "Notices", href: `/${organizationId}/admin/notices`, icon: ClipboardDocumentListIcon, current: isActive("/notices") },
    { name: "Results", href: `/${organizationId}/admin/results`, icon: ChartBarIcon, current: isActive("/results") },
    { name: "Settings", href: `/${organizationId}/admin/settings`, icon: Cog6ToothIcon, current: isActive("/settings") },
  ];

  const parentNavigation = [
    { name: "Dashboard", href: `/${organizationId}/parent/dashboard`, icon: HomeIcon, current: isActive("/dashboard") },
    { name: "Notices", href: `/${organizationId}/parent/notices`, icon: ClipboardDocumentListIcon, current: isActive("/notices") },
    { name: "Homework", href: `/${organizationId}/parent/homework`, icon: ClipboardDocumentCheckIcon, current: isActive("/homework") },
    { name: "Results", href: `/${organizationId}/parent/reports`, icon: ChartBarIcon, current: isActive("/reports") },
    { name: "Fees", href: `/${organizationId}/parent/fees`, icon: CurrencyDollarIcon, current: isActive("/fees") },
  ];

  const teacherNavigation = [
    { name: "Dashboard", href: `/${organizationId}/teacher/dashboard`, icon: HomeIcon, current: isActive("/dashboard") },
  ];

  const navigation =
    user?.role === "teacher" ? teacherNavigation : user?.role === "parent" ? parentNavigation : adminNavigation;

  return {
    navigation,
  };
};
