import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  UserGroupIcon,
  UserIcon,
  AcademicCapIcon,
  BellIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  PlusIcon,
  DocumentPlusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import { ICreateNoticeRequest } from "../../../types";
import { useGetNoticeList } from "../notices/service";
import useGetDashboardStats from "./service/get-dashboard-stats";

export const useDashboardController = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { organizationId } = useParams();
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);

  const recentNotices = useGetNoticeList(organizationId, "", "", 5, 1);
  const dashboardStats = useGetDashboardStats(organizationId || "");

  const recentUpdates = (recentNotices.data?.items || []).map((notice) => ({
    type: notice.type,
    title: notice.title,
    date: new Date(notice.createdAt).toLocaleDateString(),
  }));

  // real counts from the backend; fee/attendance/homework modules don't exist
  // yet so those come back null and render as "—" rather than a fake number
  const stats = {
    totalStudents: dashboardStats.data?.totalStudents ?? 0,
    totalTeachers: dashboardStats.data?.totalTeachers ?? 0,
    totalClasses: dashboardStats.data?.totalClasses ?? 0,
    activeNotices: dashboardStats.data?.activeNotices ?? 0,
    pendingPayments: dashboardStats.data?.pendingPayments ?? null,
    attendanceSubmitted: dashboardStats.data?.attendanceToday ?? null,
    homeworksIssued: dashboardStats.data?.homeworksToday ?? null,
  };

  // Student Performance Chart Options
  const studentPerformanceOptions = {
    chart: {
      type: "line",
      height: 300,
      style: {
        fontFamily: "inherit",
      },
    },
    title: {
      text: "Student Performance Trend",
      style: {
        fontSize: "16px",
        fontWeight: "500",
      },
    },
    xAxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      labels: {
        style: {
          color: "#6B7280",
        },
      },
    },
    yAxis: {
      title: {
        text: "Average Score",
        style: {
          color: "#6B7280",
        },
      },
      labels: {
        style: {
          color: "#6B7280",
        },
      },
    },
    series: [
      {
        name: "Class A",
        data: [75, 78, 82, 85, 80, 88],
        color: "#4F46E5",
      },
      {
        name: "Class B",
        data: [70, 72, 75, 78, 80, 82],
        color: "#818CF8",
      },
    ],
    legend: {
      itemStyle: {
        color: "#4B5563",
      },
    },
  };

  // Teacher-Student Ratio Chart Options
  const teacherStudentRatioOptions = {
    chart: {
      type: "pie",
      height: 300,
      style: {
        fontFamily: "inherit",
      },
    },
    title: {
      text: "Teacher-Student Ratio",
      style: {
        fontSize: "16px",
        fontWeight: "500",
      },
    },
    series: [
      {
        name: "Ratio",
        data: [
          { name: "Teachers", y: 45, color: "#4F46E5" },
          { name: "Students", y: 1250, color: "#818CF8" },
        ],
      },
    ],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.percentage:.1f}%",
        },
      },
    },
  };

  // Monthly Attendance Chart Options
  const monthlyAttendanceOptions = {
    chart: {
      type: "column",
      height: 300,
      style: {
        fontFamily: "inherit",
      },
    },
    title: {
      text: "Monthly Attendance Summary",
      style: {
        fontSize: "16px",
        fontWeight: "500",
      },
    },
    xAxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      labels: {
        style: {
          color: "#6B7280",
        },
      },
    },
    yAxis: {
      title: {
        text: "Attendance %",
        style: {
          color: "#6B7280",
        },
      },
      labels: {
        style: {
          color: "#6B7280",
        },
      },
    },
    series: [
      {
        name: "Attendance",
        data: [95, 92, 98, 96, 94, 97],
        color: "#4F46E5",
      },
    ],
    plotOptions: {
      column: {
        borderRadius: 5,
      },
    },
  };

  const isLoading = recentNotices.isLoading || dashboardStats.isLoading;

  // Notice modal handlers
  const openNoticeModal = () => {
    setIsNoticeModalOpen(true);
  };

  const closeNoticeModal = () => {
    setIsNoticeModalOpen(false);
  };

  const handleCreateNotice = async (formData: ICreateNoticeRequest) => {
    console.log(formData);
  };

  // User type selection modal handlers
  const openUserTypeModal = () => {
    setIsUserTypeModalOpen(true);
  };

  const closeUserTypeModal = () => {
    setIsUserTypeModalOpen(false);
  };

  const handleSelectStudent = () => {
    closeUserTypeModal();
    // Navigate to add student page
    navigate(`/${organizationId}/admin/students`);
    // You might want to open the add student modal directly
    // This would require passing state through navigation or using a global state manager
  };

  const handleSelectTeacher = () => {
    closeUserTypeModal();
    // Navigate to add teacher page
    navigate(`/${organizationId}/admin/teachers`);
    // Similarly, you might want to open the add teacher modal directly
  };

  const display = (value: number | null) => (value === null ? "—" : value);

  const statCards = [
    {
      title: "Total Students",
      value: display(stats.totalStudents),
      icon: UserGroupIcon,
    },
    { title: "Total Teachers", value: display(stats.totalTeachers), icon: UserIcon },
    {
      title: "Total Classes",
      value: display(stats.totalClasses),
      icon: AcademicCapIcon,
    },
    { title: "Active Notices", value: display(stats.activeNotices), icon: BellIcon },
    {
      title: "Pending Payments",
      value: display(stats.pendingPayments),
      icon: CurrencyDollarIcon,
    },
    {
      title: "Attendance Today",
      value: display(stats.attendanceSubmitted),
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: "Homeworks Today",
      value: display(stats.homeworksIssued),
      icon: BookOpenIcon,
    },
  ];

  const quickActions = [
    {
      title: "Add New Notice",
      icon: PlusIcon,
      action: openNoticeModal,
    },
    {
      title: "Upload Homework",
      icon: DocumentPlusIcon,
      action: () => {},
    },
    {
      title: "Add Student/Teacher",
      icon: UserPlusIcon,
      action: openUserTypeModal,
    },
  ];

  return {
    t,
    stats,
    recentUpdates,
    studentPerformanceOptions,
    teacherStudentRatioOptions,
    monthlyAttendanceOptions,
    isLoading,
    isNoticeModalOpen,
    isUserTypeModalOpen,
    statCards,
    quickActions,
    openNoticeModal,
    closeNoticeModal,
    handleCreateNotice,
    openUserTypeModal,
    closeUserTypeModal,
    handleSelectStudent,
    handleSelectTeacher,
  };
};
