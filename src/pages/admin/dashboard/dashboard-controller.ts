import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ICreateNoticeRequest } from "../../../types";
import { useTranslation } from "react-i18next";

export const useDashboardController = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { organizationId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);

  // Stats data
  const stats = {
    totalStudents: 1250,
    totalTeachers: 45,
    totalClasses: 25,
    activeNotices: 8,
    pendingPayments: 12,
    attendanceSubmitted: 18,
    homeworksIssued: 5,
  };

  // Recent updates data
  const recentUpdates = [
    { type: "notice", title: "Annual Sports Day", date: "2024-03-15" },
    { type: "fee", title: "Fee Payment Received", date: "2024-03-14" },
    { type: "homework", title: "Math Assignment", date: "2024-03-14" },
    { type: "notice", title: "Parent-Teacher Meeting", date: "2024-03-13" },
    { type: "fee", title: "Fee Payment Due", date: "2024-03-12" },
  ];

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

  const loading = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    loading();
  }, []);

  // Notice modal handlers
  const openNoticeModal = () => {
    setIsNoticeModalOpen(true);
  };

  const closeNoticeModal = () => {
    setIsNoticeModalOpen(false);
  };

  const handleAddNotice = async (formData: ICreateNoticeRequest) => {
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
    openNoticeModal,
    closeNoticeModal,
    handleAddNotice,
    openUserTypeModal,
    closeUserTypeModal,
    handleSelectStudent,
    handleSelectTeacher,
  };
};
