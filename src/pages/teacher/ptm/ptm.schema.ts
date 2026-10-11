import { z } from "zod";

export const openAvailabilitySchema = z
  .object({
    eventId: z.string().min(1, "Select a PTM event."),
    sectionId: z.string().min(1, "Select a section."),
    startAt: z.string().min(1, "Pick a start time."),
    endAt: z.string().min(1, "Pick an end time."),
  })
  .refine((value) => !value.startAt || !value.endAt || new Date(value.endAt) > new Date(value.startAt), {
    path: ["endAt"],
    message: "End must be after the start.",
  });
export type OpenAvailabilityFormValues = z.infer<typeof openAvailabilitySchema>;
export const defaultOpenAvailabilityValues: OpenAvailabilityFormValues = {
  eventId: "",
  sectionId: "",
  startAt: "",
  endAt: "",
};
