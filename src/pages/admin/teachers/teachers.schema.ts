import { z } from "zod";

export const staffProfileSchema = z.object({
  employeeCode: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  department: z.string().trim().optional(),
  qualification: z.string().trim().optional(),
  dateOfJoining: z.string().trim().optional(),
});

export type StaffProfileFormValues = z.infer<typeof staffProfileSchema>;

export const defaultStaffProfileValues: StaffProfileFormValues = {
  employeeCode: "",
  designation: "",
  department: "",
  qualification: "",
  dateOfJoining: "",
};
