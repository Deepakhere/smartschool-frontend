import { z } from "zod";

export const addSchoolSchema = z.object({
  schoolName: z.string().trim().min(1, "School name is required."),
  address: z.string().trim().min(1, "Address is required."),
  pincode: z.string().trim().min(1, "Pincode is required."),
});

export type AddSchoolFormValues = z.infer<typeof addSchoolSchema>;
