import { z } from "zod";

export const createAccountSchema = z.object({
  accountName: z.string().trim().min(1, "Account name is required."),
  ownerName: z.string().trim().min(1, "Owner name is required."),
  ownerEmail: z.string().trim().min(1, "Owner email is required.").email("Enter a valid email address."),
  schoolName: z.string().trim().min(1, "School name is required."),
  address: z.string().trim().min(1, "Address is required."),
  pincode: z.string().trim().min(1, "Pincode is required."),
});

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>;
