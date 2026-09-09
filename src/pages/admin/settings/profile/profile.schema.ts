import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().trim().min(1, "Full name is required."),
  phoneNumber: z.string().trim().optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(10, "Password must be at least 10 characters long.")
      .refine((val) => {
        const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
        return classes.filter((re) => re.test(val)).length >= 3;
      }, "Password must contain at least 3 of: lowercase, uppercase, number, symbol."),
    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const defaultChangePasswordValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};
