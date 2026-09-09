import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

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
import { useGetNoticeList, useCreateNotice } from "../notices/service";
import { useError } from "../../../hooks";
import useGetDashboardStats from "./service/get-dashboard-stats";
import useGetDashboardCharts from "./service/get-dashboard-charts";

const formatMoney = (paise: number) => `${(paise / 100).toFixed(2)}`;

export const useDashboardController = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { organizationId } = useParams();
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);

  const recentNotices = useGetNoticeList(organizationId, "", "", 5, 1);
  const dashboardStats = useGetDashboardStats(organizationId || "");
  const dashboardCharts = useGetDashboardCharts(organizationId || "");
  const createNotice = useCreateNotice(organizationId || "");

  useError({ mutation: createNotice });

  const recentUpdates = (recentNotices.data?.items || []).map((notice) => ({
    type: notice.type,
    title: notice.title,
    date: new Date(notice.createdAt).toLocaleDateString(),
  }));

  const stats = {
    totalStudents: dashboardStats.data?.totalStudents ?? 0,
    totalTeachers: dashboardStats.data?.totalTeachers ?? 0,
    totalClasses: dashboardStats.data?.totalClasses ?? 0,
    activeNotices: dashboardStats.data?.activeNotices ?? 0,
    pendingPayments: dashboardStats.data?.pendingPayments ?? null,
    attendanceSubmitted: dashboardStats.data?.attendanceToday ?? null,
    homeworksIssued: dashboardStats.data?.homeworksToday ?? null,
  };

  const examTrend = dashboardCharts.data?.examTrend || [];
  const monthlyAttendance = dashboardCharts.data?.monthlyAttendance || [];

  const studentPerformanceOptions = {
    credits: { enabled: false },
    chart: { type: "line", height: 300, style: { fontFamily: "inherit" } },
    title: { text: "Exam Performance Trend", style: { fontSize: "16px", fontWeight: "500" } },
    xAxis: {
      categories: examTrend.length ? examTrend.map((e) => e.name) : ["No published exams yet"],
      labels: { style: { color: "#6B7280" } },
    },
    yAxis: { title: { text: "Average %" }, labels: { style: { color: "#6B7280" } }, max: 100, min: 0 },
    series: [
      {
        name: "Average score",
        data: examTrend.length ? examTrend.map((e) => e.percentage) : [0],
        color: "#4F46E5",
      },
    ],
    legend: { itemStyle: { color: "#4B5563" } },
  };

  const teacherStudentRatioOptions = {
    credits: { enabled: false },
    chart: { type: "pie", height: 300, style: { fontFamily: "inherit" } },
    title: { text: "Teacher-Student Ratio", style: { fontSize: "16px", fontWeight: "500" } },
    series: [
      {
        name: "Count",
        data: [
          { name: "Teachers", y: stats.totalTeachers, color: "#4F46E5" },
          { name: "Students", y: stats.totalStudents, color: "#818CF8" },
        ],
      },
    ],
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: { enabled: true, format: "{point.percentage:.1f}%" },
      },
    },
  };

  const monthlyAttendanceOptions = {
    credits: { enabled: false },
    chart: { type: "column", height: 300, style: { fontFamily: "inherit" } },
    title: { text: "Monthly Attendance Summary", style: { fontSize: "16px", fontWeight: "500" } },
    xAxis: {
      categories: monthlyAttendance.length ? monthlyAttendance.map((m) => m.month) : ["No attendance marked yet"],
      labels: { style: { color: "#6B7280" } },
    },
    yAxis: { title: { text: "Attendance %" }, labels: { style: { color: "#6B7280" } }, max: 100, min: 0 },
    series: [
      {
        name: "Attendance",
        data: monthlyAttendance.length ? monthlyAttendance.map((m) => m.percentage) : [0],
        color: "#4F46E5",
      },
    ],
    plotOptions: { column: { borderRadius: 5 } },
  };

  const isLoading = recentNotices.isLoading || dashboardStats.isLoading;

  const openNoticeModal = () => setIsNoticeModalOpen(true);
  const closeNoticeModal = () => setIsNoticeModalOpen(false);

  const handleCreateNotice = async (formData: ICreateNoticeRequest) => {
    const noticeFormData = new FormData();
    noticeFormData.append("title", formData.title);
    noticeFormData.append("content", formData.content);
    noticeFormData.append("type", formData.type);
    if (formData.date) noticeFormData.append("date", formData.date);
    if (formData.attachment instanceof File) noticeFormData.append("attachment", formData.attachment);
    if (formData.audience) noticeFormData.append("audience", JSON.stringify(formData.audience));

    createNotice.mutate(noticeFormData);
  };

  useEffect(() => {
    if (createNotice.isSuccess) {
      toast.success(t("messages.notice_created_successfully"));
      recentNotices.refetch();
      setIsNoticeModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createNotice.isSuccess]);

  const openUserTypeModal = () => setIsUserTypeModalOpen(true);
  const closeUserTypeModal = () => setIsUserTypeModalOpen(false);

  const handleSelectStudent = () => {
    closeUserTypeModal();
    navigate(`/${organizationId}/admin/students`);
  };

  const handleSelectTeacher = () => {
    closeUserTypeModal();
    navigate(`/${organizationId}/admin/teachers`);
  };

  const handleUploadHomework = () => {
    navigate(`/${organizationId}/admin/homework`);
  };

  const display = (value: number | null) => (value === null ? "—" : value);

  const statCards = [
    { title: "Total Students", value: display(stats.totalStudents), icon: UserGroupIcon },
    { title: "Total Teachers", value: display(stats.totalTeachers), icon: UserIcon },
    { title: "Total Classes", value: display(stats.totalClasses), icon: AcademicCapIcon },
    { title: "Active Notices", value: display(stats.activeNotices), icon: BellIcon },
    {
      title: "Pending Payments",
      value: stats.pendingPayments === null ? "—" : formatMoney(stats.pendingPayments),
      icon: CurrencyDollarIcon,
    },
    { title: "Attendance Today", value: display(stats.attendanceSubmitted), icon: ClipboardDocumentCheckIcon },
    { title: "Homeworks Today", value: display(stats.homeworksIssued), icon: BookOpenIcon },
  ];

  const quickActions = [
    { title: "Add New Notice", icon: PlusIcon, action: openNoticeModal },
    { title: "Upload Homework", icon: DocumentPlusIcon, action: handleUploadHomework },
    { title: "Add Student/Teacher", icon: UserPlusIcon, action: openUserTypeModal },
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
    isCreatingNotice: createNotice.isPending,
    isSuccessNoticeCreation: createNotice.isSuccess,
    openUserTypeModal,
    closeUserTypeModal,
    handleSelectStudent,
    handleSelectTeacher,
  };
};
