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
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { useCan, useCurrentRole } from "@/context/tenant-context";
import { SHARED_PAGES } from "@/routes/shared-pages";
import type { ComponentType, SVGProps } from "react";

export interface SidebarItem {
  name: string;
  hint: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  current: boolean;
}

export interface SidebarSection {
  label?: string;
  items: SidebarItem[];
}

export const useSidebarController = () => {
  const { organizationId } = useParams();
  const location = useLocation();
  // the role decides the menu; permissions add granted pages
  const role = useCurrentRole();
  const can = useCan();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const adminSections: SidebarSection[] = [
    {
      items: [{ name: "Dashboard", hint: "Your school at a glance", href: `/${organizationId}/admin/dashboard`, icon: HomeIcon, current: isActive("/dashboard") }],
    },
    {
      label: "Academics",
      items: [
        { name: "Classes", hint: "Years, classes, sections and subjects", href: `/${organizationId}/admin/classes`, icon: AcademicCapIcon, current: isActive("/classes") },
        { name: "Timetable", hint: "Weekly periods for every section", href: `/${organizationId}/admin/timetable`, icon: TableCellsIcon, current: isActive("/timetable") },
        { name: "Students", hint: "Admissions, profiles and records", href: `/${organizationId}/admin/students`, icon: UserGroupIcon, current: isActive("/students") },
        { name: "Teachers", hint: "Staff profiles and roles", href: `/${organizationId}/admin/teachers`, icon: UserIcon, current: isActive("/teachers") },
        { name: "Attendance", hint: "Mark and review daily attendance", href: `/${organizationId}/admin/attendance`, icon: ClipboardDocumentCheckIcon, current: isActive("/attendance") },
        { name: "Homework", hint: "Assign and track homework", href: `/${organizationId}/admin/homework`, icon: BookOpenIcon, current: isActive("/homework") },
        { name: "Leave Requests", hint: "Approve or decline leave", href: `/${organizationId}/admin/leave-requests`, icon: CalendarDaysIcon, current: isActive("/leave-requests") },
        { name: "Promotion", hint: "Move students to the next class", href: `/${organizationId}/admin/promotion`, icon: ArrowTrendingUpIcon, current: isActive("/promotion") },
      ],
    },
    {
      label: "Engagement",
      items: [
        { name: "Notices", hint: "Announcements to parents and staff", href: `/${organizationId}/admin/notices`, icon: ClipboardDocumentListIcon, current: isActive("/notices") },
        { name: "Calendar", hint: "Holidays, events and exams", href: `/${organizationId}/admin/calendar`, icon: CalendarIcon, current: isActive("/calendar") },
        { name: "PTM", hint: "Parent-teacher meetings", href: `/${organizationId}/admin/ptm`, icon: UsersIcon, current: isActive("/ptm") },
      ],
    },
    {
      label: "Finance & Results",
      items: [
        { name: "Fees", hint: "Fee plans, dues and payments", href: `/${organizationId}/admin/fees`, icon: CurrencyDollarIcon, current: isActive("/fees") },
        { name: "Results", hint: "Exams, marks and report cards", href: `/${organizationId}/admin/results`, icon: ChartBarIcon, current: isActive("/results") },
      ],
    },
    {
      items: [{ name: "Settings", hint: "Profile, users and preferences", href: `/${organizationId}/admin/settings`, icon: Cog6ToothIcon, current: isActive("/settings") }],
    },
  ];

  const parentSections: SidebarSection[] = [
    {
      items: [{ name: "Dashboard", hint: "Your child's day at a glance", href: `/${organizationId}/parent/dashboard`, icon: HomeIcon, current: isActive("/dashboard") }],
    },
    {
      label: "School Life",
      items: [
        { name: "Notices", hint: "School announcements", href: `/${organizationId}/parent/notices`, icon: ClipboardDocumentListIcon, current: isActive("/notices") },
        { name: "Homework", hint: "What's due and when", href: `/${organizationId}/parent/homework`, icon: ClipboardDocumentCheckIcon, current: isActive("/homework") },
        { name: "Calendar", hint: "Holidays, events and exams", href: `/${organizationId}/parent/calendar`, icon: CalendarIcon, current: isActive("/calendar") },
        { name: "PTM", hint: "Book a meeting with the teacher", href: `/${organizationId}/parent/ptm`, icon: UsersIcon, current: isActive("/ptm") },
        { name: "Leave Requests", hint: "Ask for a day off", href: `/${organizationId}/parent/leave-requests`, icon: CalendarDaysIcon, current: isActive("/leave-requests") },
      ],
    },
    {
      label: "Finance & Results",
      items: [
        { name: "Fees", hint: "Dues, receipts and payments", href: `/${organizationId}/parent/fees`, icon: CurrencyDollarIcon, current: isActive("/fees") },
        { name: "Results", hint: "Marks and report cards", href: `/${organizationId}/parent/reports`, icon: ChartBarIcon, current: isActive("/reports") },
      ],
    },
  ];

  const teacherSections: SidebarSection[] = [
    {
      items: [{ name: "Dashboard", hint: "Your classes at a glance", href: `/${organizationId}/teacher/dashboard`, icon: HomeIcon, current: isActive("/dashboard") }],
    },
    {
      label: "Classroom",
      items: [
        { name: "My Timetable", hint: "Your periods this week", href: `/${organizationId}/teacher/timetable`, icon: TableCellsIcon, current: isActive("/timetable") },
        { name: "Calendar", hint: "Holidays, events and exams", href: `/${organizationId}/teacher/calendar`, icon: CalendarIcon, current: isActive("/calendar") },
        { name: "Attendance", hint: "Mark your section's attendance", href: `/${organizationId}/teacher/attendance`, icon: ClipboardDocumentCheckIcon, current: isActive("/attendance") },
        { name: "Homework", hint: "Assign and review homework", href: `/${organizationId}/teacher/homework`, icon: BookOpenIcon, current: isActive("/homework") },
        { name: "Marks Entry", hint: "Enter exam marks", href: `/${organizationId}/teacher/marks`, icon: ChartBarIcon, current: isActive("/marks") },
        { name: "PTM", hint: "Your parent meetings", href: `/${organizationId}/teacher/ptm`, icon: UsersIcon, current: isActive("/ptm") },
        { name: "Leave Requests", hint: "Review leave for your class", href: `/${organizationId}/teacher/leave-requests`, icon: CalendarDaysIcon, current: isActive("/leave-requests") },
      ],
    },
  ];

  const deskSections = (area: "accountant" | "staff"): SidebarSection[] => [
    {
      items: [{ name: "Calendar", hint: "Holidays, events and exams", href: `/${organizationId}/${area}/calendar`, icon: CalendarIcon, current: isActive("/calendar") }],
    },
  ];

  const grantedSection = (area: string): SidebarSection[] => {
    const items = SHARED_PAGES.filter((page) => can(...page.anyOf)).map((page) => {
      const path = page.path.replace("/*", "");
      return { ...page.nav, href: `/${organizationId}/${area}/${path}`, current: isActive(`/${area}/${path}`) };
    });
    return items.length ? [{ label: "School", items }] : [];
  };

  const sectionsByRole = {
    admin: adminSections,
    parent: parentSections,
    teacher: [...teacherSections, ...grantedSection("teacher")],
    accountant: [...grantedSection("accountant"), ...deskSections("accountant")],
    staff: [...grantedSection("staff"), ...deskSections("staff")],
  };
  const sections = sectionsByRole[role ?? "admin"];

  return {
    sections,
  };
};
