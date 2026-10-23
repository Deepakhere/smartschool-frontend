import type { ComponentType, SVGProps } from "react";
import {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  HomeIcon,
  TableCellsIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import type { AttentionKey } from "./service/attention-service";

export interface SidebarPage {
  name: string;
  hint: string;
  // under the role's area, e.g. "students" for /:org/admin/students
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  // shows a count when something on this page waits on the user
  attention?: AttentionKey;
}

export interface SidebarGroup {
  label: string;
  pages: SidebarPage[];
}

export interface SidebarMenu {
  // daily work, always on show in the same order
  main: SidebarPage[];
  // set-up and occasional work, one click away behind More
  more: SidebarGroup[];
  // pinned above the user menu
  bottom: SidebarPage[];
}

// a role with this many pages or fewer shows them all; above it, the extras go behind More
export const FLAT_MENU_LIMIT = 8;
// how many pages a long, generated menu keeps on show before the rest go behind More
export const MAIN_LIMIT = 6;

const page = (
  name: string,
  hint: string,
  path: string,
  icon: SidebarPage["icon"],
  attention?: AttentionKey
): SidebarPage => ({
  name,
  hint,
  path,
  icon,
  attention,
});

export const ADMIN_MENU: SidebarMenu = {
  main: [
    page("Dashboard", "Your school at a glance", "dashboard", HomeIcon),
    page("Students", "Admissions, profiles and records", "students", UserGroupIcon),
    page("Attendance", "Mark and review daily attendance", "attendance", ClipboardDocumentCheckIcon),
    page("Fees", "Fee plans, dues and payments", "fees", CurrencyDollarIcon),
    page("Leave Requests", "Approve or decline leave", "leave-requests", CalendarDaysIcon, "leaveRequests"),
    page("Notices", "Announcements to parents and staff", "notices", ClipboardDocumentListIcon),
  ],
  more: [
    {
      label: "Academics",
      pages: [
        page("Classes", "Years, classes, sections and subjects", "classes", AcademicCapIcon),
        page("Timetable", "Weekly periods for every section", "timetable", TableCellsIcon),
        page("Homework", "Assign and track homework", "homework", BookOpenIcon),
        page("Results", "Exams, marks and report cards", "results", ChartBarIcon, "examsToPublish"),
      ],
    },
    {
      label: "School life",
      pages: [
        page("Calendar", "Holidays, events and exams", "calendar", CalendarIcon),
        page("PTM", "Parent-teacher meetings", "ptm", UsersIcon),
      ],
    },
    {
      label: "Administration",
      pages: [
        page("Teachers", "Staff profiles and roles", "teachers", UserIcon),
        page("Promotion", "Move students to the next class", "promotion", ArrowTrendingUpIcon),
      ],
    },
  ],
  bottom: [page("Settings", "Profile, users and preferences", "settings", Cog6ToothIcon)],
};

export const TEACHER_MENU: SidebarMenu = {
  main: [
    page("Dashboard", "Your classes at a glance", "dashboard", HomeIcon),
    page("Attendance", "Mark your section's attendance", "attendance", ClipboardDocumentCheckIcon),
    page("Homework", "Assign and review homework", "homework", BookOpenIcon),
    page("Marks Entry", "Enter exam marks", "marks", ChartBarIcon),
    page("My Timetable", "Your periods this week", "timetable", TableCellsIcon),
    page("Leave Requests", "Review leave for your class", "leave-requests", CalendarDaysIcon, "leaveRequests"),
  ],
  more: [
    {
      label: "School life",
      pages: [
        page("Calendar", "Holidays, events and exams", "calendar", CalendarIcon),
        page("PTM", "Your parent meetings", "ptm", UsersIcon, "ptmBookings"),
      ],
    },
  ],
  bottom: [],
};

export const PARENT_MENU: SidebarMenu = {
  main: [
    page("Dashboard", "Your child's day at a glance", "dashboard", HomeIcon),
    page("Homework", "What's due and when", "homework", ClipboardDocumentCheckIcon),
    page("Notices", "School announcements", "notices", ClipboardDocumentListIcon),
    page("Fees", "Dues, receipts and payments", "fees", CurrencyDollarIcon),
    page("Results", "Marks and report cards", "reports", ChartBarIcon),
    page("Calendar", "Holidays, events and exams", "calendar", CalendarIcon),
    page("PTM", "Book a meeting with the teacher", "ptm", UsersIcon),
    page("Leave Requests", "Ask for a day off", "leave-requests", CalendarDaysIcon),
  ],
  more: [],
  bottom: [],
};

export const CALENDAR_PAGE = page("Calendar", "Holidays, events and exams", "calendar", CalendarIcon);
