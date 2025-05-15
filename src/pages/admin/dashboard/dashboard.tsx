import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useDashboardController } from "./dashboard-controller";
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
import LogoSpinner from "../../../components/logo-spinner";
import NoticeModal from "../../../components/notice-modal";
import UserTypeSelectionModal from "../../../components/user-type-selection-modal";

const Dashboard = () => {
  const {
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
  } = useDashboardController();

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: UserGroupIcon,
    },
    { title: "Total Teachers", value: stats.totalTeachers, icon: UserIcon },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: AcademicCapIcon,
    },
    { title: "Active Notices", value: stats.activeNotices, icon: BellIcon },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: CurrencyDollarIcon,
    },
    {
      title: "Attendance Today",
      value: stats.attendanceSubmitted,
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: "Homeworks Today",
      value: stats.homeworksIssued,
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

  return (
    <>
      {isLoading ? (
        <LogoSpinner />
      ) : (
        <div className="px-4 space-y-8 min-h-screen">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-xl hover:shadow-md transition-shadow p-6 flex items-center space-x-4"
                >
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("labels.quick_actions")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center justify-center space-x-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all hover:shadow-sm group"
                  >
                    <Icon className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-indigo-700">
                      {action.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Charts Grid */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-xl p-6">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={studentPerformanceOptions}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={teacherStudentRatioOptions}
                  />
                </div>
                <div className="bg-white rounded-xl shadow-xl p-6">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={monthlyAttendanceOptions}
                  />
                </div>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t("labels.recent_updates")}
              </h2>
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {update.title}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {update.type}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{update.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <NoticeModal
            isOpen={isNoticeModalOpen}
            onClose={closeNoticeModal}
            onSubmit={handleAddNotice}
          />

          <UserTypeSelectionModal
            isOpen={isUserTypeModalOpen}
            onClose={closeUserTypeModal}
            onSelectStudent={handleSelectStudent}
            onSelectTeacher={handleSelectTeacher}
          />
        </div>
      )}
    </>
  );
};

export default Dashboard;
