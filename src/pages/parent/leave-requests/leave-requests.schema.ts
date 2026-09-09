import { z } from "zod";

const today = () => new Date().toISOString().slice(0, 10);

export const leaveRequestFormSchema = z
  .object({
    studentId: z.string().trim().min(1, "Select a child."),
    fromDate: z.string().trim().min(1, "From date is required."),
    toDate: z.string().trim().min(1, "To date is required."),
    reason: z.string().trim().min(1, "Reason is required."),
    attachment: z.instanceof(File).nullable(),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "From date cannot be after to date.",
    path: ["toDate"],
  });

export type LeaveRequestFormValues = z.infer<typeof leaveRequestFormSchema>;

export const defaultLeaveRequestFormValues: LeaveRequestFormValues = {
  studentId: "",
  fromDate: today(),
  toDate: today(),
  reason: "",
  attachment: null,
};
