import { z } from "zod";

export const userFormSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  role: z.enum(["admin", "teacher", "accountant", "staff", "parent"]),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const defaultUserFormValues: UserFormValues = { fullname: "", email: "", role: "teacher" };
