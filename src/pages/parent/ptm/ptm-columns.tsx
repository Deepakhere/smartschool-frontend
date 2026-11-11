import { DataTableColumn } from "@/shared/ui/data-table";
import { IPTMBooking } from "@/entities/ptm";
import { CancelCell, JoinLink } from "./components/booking-cells";
import { slotOf } from "./ptm.utils";

const shortTime = (value: string) => new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

const studentName = (booking: IPTMBooking) => (typeof booking.studentId === "object" ? booking.studentId.name : "");

export const bookingColumns = (cancel: (bookingId: string) => void, compact = false): DataTableColumn<IPTMBooking>[] =>
  compact ? compactBookingColumns(cancel) : wideBookingColumns(cancel);

// below the desktop width a booking is one cell (student, time, join link) and the action beside it
const compactBookingColumns = (cancel: (bookingId: string) => void): DataTableColumn<IPTMBooking>[] => [
  {
    id: "booking",
    header: "Booking",
    cell: ({ row: { original: booking } }) => {
      const slot = slotOf(booking);
      return (
        <div className="space-y-0.5">
          <p className="font-medium text-gray-900">{studentName(booking)}</p>
          {slot && <p className="text-xs text-gray-500">{shortTime(slot.startAt)}</p>}
          {slot?.meetingLink && <JoinLink booking={booking} />}
        </div>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    meta: { align: "right" },
    cell: ({ row }) => <CancelCell booking={row.original} cancel={cancel} />,
  },
];

const wideBookingColumns = (cancel: (bookingId: string) => void): DataTableColumn<IPTMBooking>[] => [
  {
    id: "student",
    header: "Student",
    cell: ({ row }) => <span className="font-medium text-gray-900">{studentName(row.original)}</span>,
  },
  {
    id: "time",
    header: "Time",
    meta: { align: "center" },
    cell: ({ row }) => {
      const slot = slotOf(row.original);
      return slot ? shortTime(slot.startAt) : "";
    },
  },
  {
    id: "join",
    header: "Join",
    meta: { align: "center" },
    cell: ({ row }) => <JoinLink booking={row.original} />,
  },
  {
    id: "action",
    header: "Action",
    meta: { align: "center" },
    cell: ({ row }) => <CancelCell booking={row.original} cancel={cancel} />,
  },
];
