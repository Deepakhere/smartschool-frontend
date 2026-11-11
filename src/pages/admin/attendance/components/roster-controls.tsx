import { Input } from "@/shared/ui/kit/input";
import { cn } from "@/shared/lib/utils";
import { AttendanceStatus, ISectionRosterStudent } from "@/entities/attendance";
import type { RosterColumnProps } from "../attendance-columns";

const STATUSES: AttendanceStatus[] = ["present", "absent", "late", "excused"];

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-green-100 text-green-800 border-green-300",
  absent: "bg-red-100 text-red-800 border-red-300",
  late: "bg-amber-100 text-amber-800 border-amber-300",
  excused: "bg-gray-100 text-gray-800 border-gray-300",
};

export const StatusButtons = ({
  student,
  statuses,
  setStatus,
  className,
}: Pick<RosterColumnProps, "statuses" | "setStatus"> & {
  student: ISectionRosterStudent;
  className?: string;
}) => {
  const current = statuses[student.id] || "present";
  return (
    <div
      role="radiogroup"
      aria-label={`Attendance for ${student.name}`}
      className={cn("inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5", className)}
    >
      {STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          role="radio"
          aria-checked={current === status}
          onClick={() => setStatus(student.id, status)}
          className={cn(
            "rounded-md border px-3 py-1 text-xs font-medium capitalize transition-colors max-lg:flex-1 max-lg:py-2",
            current === status ? STATUS_STYLES[status] : "border-transparent text-gray-500 hover:text-gray-800"
          )}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export const ReasonInput = ({
  student,
  reasons,
  setReason,
  className,
}: Pick<RosterColumnProps, "reasons" | "setReason"> & {
  student: ISectionRosterStudent;
  className?: string;
}) => (
  <Input
    type="text"
    placeholder="Reason (optional)"
    aria-label={`Reason for ${student.name}`}
    className={cn("h-8 px-2 py-1 text-xs", className)}
    value={reasons[student.id] || ""}
    onChange={(e) => setReason(student.id, e.target.value)}
  />
);
