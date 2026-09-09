import { z } from "zod";

// create mode: class/section/roll number are picked here. edit mode locks those three
// (enrollment changes go through Promote/Transfer instead), so they're optional there.
export const createStudentSchema = z.object({
  id: z.string().optional(),
  admissionNumber: z.string().trim().min(1, "Admission number is required."),
  admissionDate: z.string().trim().min(1, "Admission date is required."),
  name: z.string().trim().min(1, "Full name is required."),
  academicYearId: z.string().trim().min(1, "Select an academic year."),
  classId: z.string().trim().min(1, "Select a class."),
  sectionId: z.string().trim().min(1, "Select a section."),
  rollNumber: z.string().trim().min(1, "Roll number is required."),
  dateOfBirth: z.string().trim().min(1, "Date of birth is required."),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().min(1, "State is required."),
  address: z.string().trim().min(1, "Address is required."),
  parentEmail: z.string().trim().min(1, "Parent email is required.").email("Enter a valid email address."),
  parentName: z.string().trim().min(1, "Parent name is required."),
  phoneNumber: z.string().trim().min(1, "Phone number is required."),
});

// same shape as createStudentSchema (classId/sectionId/rollNumber stay required strings,
// just never validated as non-empty) so both schemas produce an identical form-values type
export const editStudentSchema = createStudentSchema.extend({
  classId: z.string(),
  sectionId: z.string(),
  rollNumber: z.string(),
});

export type StudentFormValues = z.infer<typeof createStudentSchema>;
