import { IPTMBooking } from "@/entities/ptm";

export const slotOf = (booking: IPTMBooking) => (typeof booking.slotId === "object" ? booking.slotId : null);
