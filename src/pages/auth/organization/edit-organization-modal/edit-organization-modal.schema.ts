import { z } from "zod";

export const organizationFormSchema = z.object({
  name: z.string().trim().min(1, "Organization name is required."),
  address: z.string().trim().min(1, "Address is required."),
  pincode: z.string().trim().min(1, "Pincode is required."),
  description: z.string().trim().optional(),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
