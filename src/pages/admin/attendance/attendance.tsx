import LogoSpinner from "../../../components/logo-spinner";
import useAttendanceController from "./attendance-controller";
import { AttendanceStatus } from "../../../types";

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";
const btnPrimary =
  "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50";
const btnSecondary =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-green-100 text-green-800 border-green-300",
  absent: "bg-red-100 text-red-800 border-red-300",
  late: "bg-amber-100 text-amber-800 border-amber-300",
  excused: "bg-blue-100 text-blue-800 border-blue-300",
};

const AdminAttendance = () => {
  const c = useAttendanceController();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">Mark and review daily attendance for a class section</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Academic Year</label>
            <select className={inputClass} value={c.academicYearId} onChange={(e) => c.setAcademicYearId(e.target.value)}>
              <option value="">Select</option>
              {c.academicYears.map((y) => (
                <option key={y.id} value={y.id}>{y.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select className={inputClass} value={c.classId} onChange={(e) => c.setClassId(e.target.value)} disabled={!c.academicYearId}>
              <option value="">Select</option>
              {c.classes.map((k) => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Section</label>
            <select className={inputClass} value={c.sectionId} onChange={(e) => c.setSectionId(e.target.value)} disabled={!c.classId}>
              <option value="">Select</option>
              {c.sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" className={inputClass} value={c.date} onChange={(e) => c.setDate(e.target.value)} />
          </div>
        </div>
      </div>

      {c.sectionId && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Students {c.summary && <span className="text-sm text-gray-500 font-normal">— {c.summary.present} present / {c.summary.total} total</span>}
            </h2>
            <div className="flex gap-2">
              <button className={btnSecondary} onClick={() => c.markAll("present")}>Mark all present</button>
              <button className={btnSecondary} onClick={() => c.markAll("absent")}>Mark all absent</button>
            </div>
          </div>

          {c.isLoadingRoster ? (
            <LogoSpinner offsetSidebar />
          ) : c.students.length === 0 ? (
            <p className="px-4 py-5 text-sm text-gray-500">No students in this section.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {c.students.map((student) => (
                <div key={student.id} className="px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">Roll No. {student.currentEnrollment?.rollNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    {(["present", "absent", "late", "excused"] as AttendanceStatus[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => c.setStatus(student.id, status)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                          (c.statuses[student.id] || "present") === status
                            ? STATUS_STYLES[status]
                            : "bg-white text-gray-500 border-gray-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  {(c.statuses[student.id] === "absent" || c.statuses[student.id] === "late" || c.statuses[student.id] === "excused") && (
                    <input
                      type="text"
                      placeholder="Reason (optional)"
                      className="w-40 rounded-md border border-gray-300 px-2 py-1 text-xs"
                      value={c.reasons[student.id] || ""}
                      onChange={(e) => c.setReason(student.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="px-4 py-4 border-t border-gray-200 flex justify-end">
            <button onClick={c.submit} disabled={c.isSaving} className={btnPrimary}>
              Save Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
