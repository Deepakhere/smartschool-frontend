import LogoSpinner from "../../../components/logo-spinner";
import useTeacherDashboardController from "./dashboard-controller";

const TeacherDashboard = () => {
  const c = useTeacherDashboardController();

  if (c.isLoading) {
    return <LogoSpinner offsetSidebar />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome, {c.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Here's your teaching overview for today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Today's Timetable ({c.todayName})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {c.todaySlots.length === 0 ? (
              <p className="px-4 py-5 text-sm text-gray-500">No classes scheduled for today.</p>
            ) : (
              c.todaySlots.map((slot) => (
                <div key={slot.id} className="px-4 py-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {slot.subjectId?.name} — {slot.classId?.name} {slot.sectionId?.name}
                    </p>
                    {slot.room && <p className="text-xs text-gray-500">Room {slot.room}</p>}
                  </div>
                  <p className="text-sm text-gray-500">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Notices</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {c.recentNotices.length === 0 ? (
              <p className="px-4 py-5 text-sm text-gray-500">No notices yet.</p>
            ) : (
              c.recentNotices.map((notice) => (
                <div key={notice.id} className="px-4 py-4 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">{notice.title}</p>
                  <p className="text-sm text-gray-500">{new Date(notice.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Assigned Classes */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Assigned Classes</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {c.assignments.length === 0 ? (
            <p className="px-4 py-5 text-sm text-gray-500">You have no class assignments yet.</p>
          ) : (
            c.assignments.map((a) => (
              <div key={a.id} className="px-4 py-4 flex justify-between items-center">
                <p className="text-sm font-medium text-gray-900">
                  {a.classId?.name} {a.sectionId?.name}
                  {a.subjectId && <span className="text-gray-500"> — {a.subjectId.name}</span>}
                </p>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {a.assignmentRole === "CLASS_TEACHER" ? "Class Teacher" : "Subject Teacher"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
