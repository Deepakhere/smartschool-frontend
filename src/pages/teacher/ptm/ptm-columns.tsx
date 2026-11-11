import { DataTableColumn } from "@/shared/ui/data-table";
import { Badge } from "@/shared/ui/kit/badge";
import { IPTMBooking, IPTMSlot } from "@/entities/ptm";

export type AgendaItem = { slot: IPTMSlot; booking: IPTMBooking | null };

const shortTime = (value: string) => new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

const studentOf = ({ booking }: AgendaItem) =>
  booking && typeof booking.studentId === "object" ? booking.studentId.name : "-";

const statusBadge = ({ booking }: AgendaItem) => (
  <Badge tone={booking ? "green" : "gray"}>{booking ? "Booked" : "Open"}</Badge>
);

// below the desktop width the student sits under the time so the status stays on screen
export const agendaColumns = (compact: boolean): DataTableColumn<AgendaItem>[] =>
  compact
    ? [
        {
          id: "time",
          header: "Time",
          cell: ({ row }) => (
            <div>
              <p className="font-medium text-gray-900">{shortTime(row.original.slot.startAt)}</p>
              <p className="text-xs text-gray-500">{studentOf(row.original)}</p>
            </div>
          ),
        },
        { id: "status", header: "Status", meta: { align: "right" }, cell: ({ row }) => statusBadge(row.original) },
      ]
    : wideAgendaColumns;

const wideAgendaColumns: DataTableColumn<AgendaItem>[] = [
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => <span className="font-medium text-gray-900">{shortTime(row.original.slot.startAt)}</span>,
  },
  {
    id: "student",
    header: "Student",
    meta: { align: "center" },
    cell: ({ row }) => studentOf(row.original),
  },
  {
    id: "status",
    header: "Status",
    meta: { align: "center" },
    cell: ({ row }) => statusBadge(row.original),
  },
];
