import { z } from "zod";

export const setPasswordSchema = z
  .object({
    password: z.string().min(10, "Password must be at least 10 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
