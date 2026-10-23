import { CheckCircleIcon, DocumentChartBarIcon, TableCellsIcon } from "@heroicons/react/24/outline";

import ActionButtons from "@/components/action-buttons";
import CustomSelectDropdown from "@/components/custom-select";
import DataTable, { DataTableColumn } from "@/components/data-table";
import EmptyState from "@/components/empty-state";
import SectionHeader from "@/components/section-header";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceStatus, SelectOption } from "@/types";
import { formatDate } from "@/utils";
import useAttendanceController, { percent } from "./attendance-controller";
import MonthlyRegister from "./components/monthly-register";
import { ISectionAttendanceReportRow } from "./service/attendance-service";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-green-100 text-green-800 border-green-300",
  absent: "bg-red-100 text-red-800 border-red-300",
  late: "bg-amber-100 text-amber-800 border-amber-300",
  excused: "bg-gray-100 text-gray-800 border-gray-300",
};

const reportColumns: DataTableColumn<ISectionAttendanceReportRow>[] = [
  { id: "rollNumber", header: "Roll No.", meta: { className: "text-gray-500" }, cell: ({ row }) => row.original.rollNumber },
  { id: "student", header: "Student", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.studentName}</span> },
  { id: "present", header: "Present", meta: { align: "center" }, cell: ({ row }) => <span className="text-green-700">{row.original.present}</span> },
  { id: "absent", header: "Absent", meta: { align: "center" }, cell: ({ row }) => <span className="text-red-700">{row.original.absent}</span> },
  { id: "late", header: "Late", meta: { align: "center" }, cell: ({ row }) => <span className="text-amber-700">{row.original.late}</span> },
  { id: "excused", header: "Excused", meta: { align: "center" }, cell: ({ row }) => <span className="text-gray-700">{row.original.excused}</span> },
  {
    id: "percent",
    header: "%",
    meta: { align: "center" },
    cell: ({ row }) => <span className="font-medium text-gray-900">{percent(row.original)}%</span>,
  },
];

const TABS = [
  { key: "mark", label: "Mark Attendance", icon: CheckCircleIcon },
  { key: "report", label: "Attendance Report", icon: DocumentChartBarIcon },
  { key: "register", label: "Monthly Register", icon: TableCellsIcon },
] as const;

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

      <Tabs value={c.activeTab} onValueChange={(value) => c.setActiveTab(value as typeof c.activeTab)}>
        <TabsList>
          {TABS.map(({ key, label, icon: Icon }) => (
            <TabsTrigger key={key} value={key}>
              <Icon />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
            <div className="flex min-w-0 gap-2">
              <div className="min-w-0 flex-1">
                <Label>From</Label>
                <Input
                  type="date"
                  value={c.reportFrom}
                  onChange={(e) => c.setReportFrom(e.target.value)}
                />
              </div>
              <div className="min-w-0 flex-1">
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

      {!c.sectionId && !c.hasNoClasses && (
        <div className="bg-white shadow rounded-lg">
          <EmptyState
            title={c.classes.length ? "Pick a class and section" : "No classes yet"}
            description={c.classes.length ? "Choose a class and section above to mark or review attendance." : "Add an academic year, classes and sections on the Classes page first."}
          />
        </div>
      )}

      {c.activeTab === "register" && c.sectionId && (
        <MonthlyRegister
          organizationId={c.organizationId}
          sectionId={c.sectionId}
          month={c.registerMonth}
          sectionLabel={`${c.classes.find((k) => k.id === c.classId)?.name ?? ""} ${c.sections.find((s) => s.id === c.sectionId)?.name ?? ""}`.trim()}
        />
      )}

      {c.activeTab === "report" && c.sectionId && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-900">
            Attendance from {formatDate(`${c.reportFrom}T00:00:00`)} to {formatDate(`${c.reportTo}T00:00:00`)}
            <span className="text-sm text-gray-500 font-normal"> - {c.reportTotalSessions} day(s) marked</span>
          </h2>
          <DataTable
            columns={reportColumns}
            data={c.reportRows}
            getRowId={(row) => row.studentId}
            isLoading={c.isLoadingReport}
            itemLabel="students"
            pagination={{ pageSize: 20 }}
            actions={[{ label: "Export CSV", onClick: c.exportReport, hidden: c.reportRows.length === 0 }]}
            empty={{ title: "No attendance in this range", description: "Nothing was marked for this section between these dates." }}
          />
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
              <ActionButtons
                actions={[
                  { label: "Export CSV", onClick: c.exportRoster },
                  { label: "Mark all present", onClick: () => c.markAll("present") },
                  { label: "Mark all absent", onClick: () => c.markAll("absent") },
                ]}
              />
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
