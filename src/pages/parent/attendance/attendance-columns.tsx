import { DataTableColumn } from "@/components/data-table";
import { Badge, BadgeTone } from "@/components/ui/badge";
import { AttendanceStatus, IAttendanceRecord } from "@/types";

const STATUS_TONE: Record<AttendanceStatus, BadgeTone> = {
  present: "green",
  absent: "red",
  late: "yellow",
  excused: "blue",
};

export const attendanceColumns: DataTableColumn<IAttendanceRecord>[] = [
  {
    id: "date",
    header: "Date",
    cell: ({ row }) =>
      row.original.date
        ? new Date(`${row.original.date}T00:00:00`).toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
          })
        : "-",
  },
  {
    id: "status",
    header: "Status",
    meta: { align: "center" },
    cell: ({ row }) => (
      <Badge tone={STATUS_TONE[row.original.status]} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "reason",
    header: "Reason",
    meta: { align: "center", className: "text-gray-500" },
    cell: ({ row }) => row.original.reason || "-",
  },
];
