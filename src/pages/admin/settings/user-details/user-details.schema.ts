import { z } from "zod";

export const userFormSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  role: z.enum(["admin", "parent", "teacher"]),
  permissions: z.object({
    canRead: z.boolean(),
    canCreate: z.boolean(),
    canUpdate: z.boolean(),
    canDelete: z.boolean(),
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const defaultUserFormValues: UserFormValues = {
  fullname: "",
  email: "",
  role: "admin",
  permissions: { canRead: false, canCreate: false, canUpdate: false, canDelete: false },
};
