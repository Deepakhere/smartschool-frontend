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
  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
    { name: "Classes", href: "/admin/classes", icon: AcademicCapIcon },
    { name: "Students", href: "/admin/students", icon: UserGroupIcon },
    { name: "Teachers", href: "/admin/teachers", icon: UserIcon },
    { name: "Fees", href: "/admin/fees", icon: CurrencyDollarIcon },
    {
      name: "Attendance",
      href: "/admin/attendance",
      icon: ClipboardDocumentCheckIcon,
    },
    { name: "Exams", href: "/admin/exams", icon: ClipboardDocumentListIcon },
    { name: "Results", href: "/admin/results", icon: ChartBarIcon },
    { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
  ];

  return {
    navigation,
  };
};
