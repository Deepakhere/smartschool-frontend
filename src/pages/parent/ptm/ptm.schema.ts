import { z } from "zod";

export const bookingSchema = z.object({ studentId: z.string().min(1, "Select a child to book for.") });
export type BookingFormValues = z.infer<typeof bookingSchema>;
export const defaultBookingValues: BookingFormValues = { studentId: "" };
