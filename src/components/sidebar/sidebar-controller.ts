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

export const useSidebarController = () => {
  const { organizationId } = useParams();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const navigation = [
    {
      name: "Dashboard",
      href: `/${organizationId}/admin/dashboard`,
      icon: HomeIcon,
      current: isActive("/dashboard"),
    },
    {
      name: "Classes",
      href: `/${organizationId}/admin/classes`,
      icon: AcademicCapIcon,
      current: isActive("/classes"),
    },
    {
      name: "Students",
      href: `/${organizationId}/admin/students`,
      icon: UserGroupIcon,
      current: isActive("/students"),
    },
    {
      name: "Teachers",
      href: `/${organizationId}/admin/teachers`,
      icon: UserIcon,
      current: isActive("/teachers"),
    },
    {
      name: "Fees",
      href: `/${organizationId}/admin/fees`,
      icon: CurrencyDollarIcon,
      current: isActive("/fees"),
    },
    {
      name: "Attendance",
      href: `/${organizationId}/admin/attendance`,
      icon: ClipboardDocumentCheckIcon,
      current: isActive("/attendance"),
    },
    {
      name: "Exams",
      href: `/${organizationId}/admin/exams`,
      icon: ClipboardDocumentListIcon,
      current: isActive("/exams"),
    },
    {
      name: "Results",
      href: `/${organizationId}/admin/results`,
      icon: ChartBarIcon,
      current: isActive("/results"),
    },
    {
      name: "Settings",
      href: `/${organizationId}/admin/settings`,
      icon: Cog6ToothIcon,
      current: isActive("/settings"),
    },
  ];

  return {
    navigation,
  };
};
