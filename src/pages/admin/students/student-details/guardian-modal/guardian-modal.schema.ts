import { z } from "zod";

export const guardianFormSchema = z.object({
  parentEmail: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  parentName: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  relationshipType: z.string(),
  isPrimaryGuardian: z.boolean(),
  isEmergencyContact: z.boolean(),
  canPickup: z.boolean(),
});

export type GuardianFormValues = z.infer<typeof guardianFormSchema>;

export const defaultGuardianFormValues: GuardianFormValues = {
  parentEmail: "",
  parentName: "",
  phoneNumber: "",
  relationshipType: "GUARDIAN",
  isPrimaryGuardian: false,
  isEmergencyContact: false,
  canPickup: true,
};
