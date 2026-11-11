import { DataTableColumn } from "@/shared/ui/data-table";
import { AttendanceStatus } from "@/entities/attendance";
import { ReasonInput, StatusButtons } from "./components/roster-controls";
import { percent } from "./attendance-controller";
import { ISectionAttendanceReportRow, ISectionRosterStudent } from "@/entities/attendance";

export interface RosterColumnProps {
  statuses: Record<string, AttendanceStatus>;
  reasons: Record<string, string>;
  setStatus: (studentId: string, status: AttendanceStatus) => void;
  setReason: (studentId: string, reason: string) => void;
  compact?: boolean;
}

// a register row: roll, name, one tap to change the mark, and a reason only when it isn't present.
// Below the desktop width the row stacks into a single cell so every status button stays on screen
export const rosterColumns = ({ compact, ...marks }: RosterColumnProps): DataTableColumn<ISectionRosterStudent>[] => {
  const { statuses } = marks;
  if (compact) {
    return [
      {
        id: "student",
        header: "Student",
        meta: { className: "w-full" },
        cell: ({ row: { original: student } }) => (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">
              {student.currentEnrollment?.rollNumber && (
                <span className="mr-2 font-normal text-gray-500">{student.currentEnrollment.rollNumber}.</span>
              )}
              {student.name}
            </p>
            <StatusButtons student={student} statuses={statuses} setStatus={marks.setStatus} className="flex w-full" />
            {(statuses[student.id] || "present") !== "present" && (
              <ReasonInput student={student} reasons={marks.reasons} setReason={marks.setReason} className="w-full" />
            )}
          </div>
        ),
      },
    ];
  }
  return [
    {
      id: "roll",
      header: "Roll",
      meta: { className: "w-16 text-gray-500" },
      cell: ({ row }) => row.original.currentEnrollment?.rollNumber || "-",
    },
    {
      id: "student",
      header: "Student",
      cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span>,
    },
    {
      id: "status",
      header: "Attendance",
      meta: { align: "center" },
      cell: ({ row: { original: student } }) => (
        <StatusButtons student={student} statuses={statuses} setStatus={marks.setStatus} />
      ),
    },
    {
      id: "reason",
      header: "Reason",
      meta: { align: "center", className: "w-64" },
      cell: ({ row: { original: student } }) =>
        (statuses[student.id] || "present") === "present" ? (
          <span className="text-gray-300">-</span>
        ) : (
          <ReasonInput
            student={student}
            reasons={marks.reasons}
            setReason={marks.setReason}
            className="mx-auto max-w-56"
          />
        ),
    },
  ];
};

export const reportColumns: DataTableColumn<ISectionAttendanceReportRow>[] = [
  {
    id: "rollNumber",
    header: "Roll No.",
    meta: { className: "text-gray-500" },
    cell: ({ row }) => row.original.rollNumber,
  },
  {
    id: "student",
    header: "Student",
    cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.studentName}</span>,
  },
  {
    id: "present",
    header: "Present",
    meta: { align: "center" },
    cell: ({ row }) => <span className="text-green-700">{row.original.present}</span>,
  },
  {
    id: "absent",
    header: "Absent",
    meta: { align: "center" },
    cell: ({ row }) => <span className="text-red-700">{row.original.absent}</span>,
  },
  {
    id: "late",
    header: "Late",
    meta: { align: "center" },
    cell: ({ row }) => <span className="text-amber-700">{row.original.late}</span>,
  },
  {
    id: "excused",
    header: "Excused",
    meta: { align: "center" },
    cell: ({ row }) => <span className="text-gray-700">{row.original.excused}</span>,
  },
  {
    id: "percent",
    header: "%",
    meta: { align: "center" },
    cell: ({ row }) => <span className="font-medium text-gray-900">{percent(row.original)}%</span>,
  },
];
