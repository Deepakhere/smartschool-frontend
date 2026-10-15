import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableSkeleton } from "@/components/table";
import SectionHeader from "@/components/section-header";
import Spinner from "@/components/spinner";
import CustomSelectDropdown from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAttendanceController from "./attendance-controller";
import MonthlyRegister from "./components/monthly-register";
import { AttendanceStatus, SelectOption } from "@/types";
import { exportToCsv, formatDate } from "@/utils";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-green-100 text-green-800 border-green-300",
  absent: "bg-red-100 text-red-800 border-red-300",
  late: "bg-amber-100 text-amber-800 border-amber-300",
  excused: "bg-gray-100 text-gray-800 border-gray-300",
};

const TAB_LABELS = { mark: "Mark Attendance", report: "Attendance Report", register: "Monthly Register" } as const;

const AdminAttendance = () => {
  const c = useAttendanceController();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader title="Attendance" description="Mark daily attendance, review it over a date range, or see a month day by day" />

      {c.hasNoClasses && (
        <p className="mb-4 rounded-lg bg-white p-4 text-sm text-gray-600 shadow">
          You are not assigned to any class yet. Ask your school admin to assign you to a section.
        </p>
      )}

      <div className="flex gap-6 border-b border-gray-200">
        {(["mark", "report", "register"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => c.setActiveTab(tab)}
            className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium ${
              c.activeTab === tab
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <Label>Academic Year</Label>
            <CustomSelectDropdown
              placeholder="Select"
              options={c.academicYears.map((y): SelectOption => ({ id: y.id, name: y.name }))}
              value={(() => {
                const y = c.academicYears.find((y) => y.id === c.academicYearId);
                return y ? { id: y.id, name: y.name } : null;
              })()}
              onChange={(o) => c.setAcademicYearId(String(o.id))}
            />
          </div>
          <div>
            <Label>Class</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.academicYearId}
              options={c.classes.map((k): SelectOption => ({ id: k.id, name: k.name }))}
              value={(() => {
                const k = c.classes.find((k) => k.id === c.classId);
                return k ? { id: k.id, name: k.name } : null;
              })()}
              onChange={(o) => c.setClassId(String(o.id))}
            />
          </div>
          <div>
            <Label>Section</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.classId}
              options={c.sections.map((s): SelectOption => ({ id: s.id, name: s.name }))}
              value={(() => {
                const s = c.sections.find((s) => s.id === c.sectionId);
                return s ? { id: s.id, name: s.name } : null;
              })()}
              onChange={(o) => c.setSectionId(String(o.id))}
            />
          </div>
          {c.activeTab === "mark" ? (
            <div>
              <Label>Date</Label>
              <Input type="date" value={c.date} onChange={(e) => c.setDate(e.target.value)} />
            </div>
          ) : c.activeTab === "register" ? (
            <div>
              <Label>Month</Label>
              <Input type="month" value={c.registerMonth} onChange={(e) => c.setRegisterMonth(e.target.value)} />
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>From</Label>
                <Input
                  type="date"
                  value={c.reportFrom}
                  onChange={(e) => c.setReportFrom(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label>To</Label>
                <Input
                  type="date"
                  value={c.reportTo}
                  onChange={(e) => c.setReportTo(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {c.activeTab === "register" && c.sectionId && (
        <MonthlyRegister
          organizationId={c.organizationId}
          sectionId={c.sectionId}
          month={c.registerMonth}
          sectionLabel={`${c.classes.find((k) => k.id === c.classId)?.name ?? ""} ${c.sections.find((s) => s.id === c.sectionId)?.name ?? ""}`.trim()}
        />
      )}

      {c.activeTab === "report" && c.sectionId && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Attendance over {c.reportFrom} – {c.reportTo}
              <span className="text-sm text-gray-500 font-normal"> - {c.reportTotalSessions} day(s) marked</span>
            </h2>
            {c.reportRows.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  exportToCsv(
                    `attendance-report-${c.reportFrom}-to-${c.reportTo}`,
                    c.reportRows.map((row) => ({
                      roll_number: row.rollNumber,
                      student: row.studentName,
                      present: row.present,
                      absent: row.absent,
                      late: row.late,
                      excused: row.excused,
                      total_days: row.total,
                      attendance_percent: row.total ? ((row.present / row.total) * 100).toFixed(1) : "0",
                    }))
                  )
                }
              >
                Export CSV
              </Button>
            )}
          </div>

          {c.isLoadingReport ? (
            <Table>
              <TableHeader>
                <TableHead>Roll No.</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Late</TableHead>
                <TableHead className="text-center">Excused</TableHead>
                <TableHead className="text-center">%</TableHead>
              </TableHeader>
              <TableSkeleton columns={7} />
            </Table>
          ) : c.reportRows.length === 0 ? (
            <p className="px-4 py-5 text-sm text-gray-500">No attendance marked for this section in this range.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Roll No.</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Late</TableHead>
                <TableHead className="text-center">Excused</TableHead>
                <TableHead className="text-center">%</TableHead>
              </TableHeader>
              <TableBody>
                {c.reportRows.map((row) => (
                  <TableRow key={row.studentId}>
                    <TableCell className="text-gray-500">{row.rollNumber}</TableCell>
                    <TableCell className="font-medium text-gray-900">{row.studentName}</TableCell>
                    <TableCell className="text-center text-green-700">{row.present}</TableCell>
                    <TableCell className="text-center text-red-700">{row.absent}</TableCell>
                    <TableCell className="text-center text-amber-700">{row.late}</TableCell>
                    <TableCell className="text-center text-gray-700">{row.excused}</TableCell>
                    <TableCell className="text-center font-medium text-gray-900">
                      {row.total ? ((row.present / row.total) * 100).toFixed(1) : "0"}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {c.activeTab === "mark" && c.sectionId && c.holidayTitle && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {formatDate(`${c.date}T00:00:00`)} is a holiday on the school calendar ({c.holidayTitle}). Only save attendance if the school is open that day.
        </p>
      )}

      {c.activeTab === "mark" && c.sectionId && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Students{" "}
              {c.summary && (
                <span className="text-sm text-gray-500 font-normal">
                  - {c.summary.present} present / {c.summary.total} total
                </span>
              )}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  exportToCsv(
                    `attendance-${c.date}`,
                    c.students.map((student) => ({
                      student: student.name,
                      roll_number: student.currentEnrollment?.rollNumber ?? "",
                      status: c.statuses[student.id] || "present",
                      reason: c.reasons[student.id] || "",
                      date: c.date,
                    }))
                  )
                }
              >
                Export CSV
              </Button>
              <Button variant="secondary" size="sm" onClick={() => c.markAll("present")}>
                Mark all present
              </Button>
              <Button variant="secondary" size="sm" onClick={() => c.markAll("absent")}>
                Mark all absent
              </Button>
            </div>
          </div>

          {c.isLoadingRoster ? (
            <Spinner />
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
                  {(c.statuses[student.id] === "absent" ||
                    c.statuses[student.id] === "late" ||
                    c.statuses[student.id] === "excused") && (
                    <Input
                      type="text"
                      placeholder="Reason (optional)"
                      className="w-40 px-2 py-1 text-xs sm:text-xs"
                      value={c.reasons[student.id] || ""}
                      onChange={(e) => c.setReason(student.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="px-4 py-4 border-t border-gray-200 flex justify-end">
            <Button onClick={c.submit} disabled={c.isSaving}>
              Save Attendance
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
