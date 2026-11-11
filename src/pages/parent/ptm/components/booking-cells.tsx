import { Button } from "@/shared/ui/kit/button";
import { IPTMBooking } from "@/entities/ptm";
import { slotOf } from "../ptm.utils";

export const CancelCell = ({ booking, cancel }: { booking: IPTMBooking; cancel: (bookingId: string) => void }) => {
  const slot = slotOf(booking);
  return slot && new Date(slot.startAt) > new Date() ? (
    <Button variant="link" onClick={() => cancel(booking.id)} className="text-red-600 hover:text-red-800">
      Cancel
    </Button>
  ) : (
    <span className="text-sm text-gray-400">Past</span>
  );
};

export const JoinLink = ({ booking }: { booking: IPTMBooking }) => {
  const link = slotOf(booking)?.meetingLink;
  return link ? (
    <a href={link} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
      Join link
    </a>
  ) : (
    "-"
  );
};
