import { z } from "zod";

export const yearFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  startDate: z.string().trim().min(1, "Start date is required."),
  endDate: z.string().trim().min(1, "End date is required."),
  isCurrent: z.boolean(),
});
export type YearFormValues = z.infer<typeof yearFormSchema>;
export const defaultYearFormValues: YearFormValues = { name: "", startDate: "", endDate: "", isCurrent: false };

export const classFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  numericLevel: z.string().trim().optional(),
});
export type ClassFormValues = z.infer<typeof classFormSchema>;
export const defaultClassFormValues: ClassFormValues = { name: "", numericLevel: "" };

export const sectionFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  capacity: z.string().trim().optional(),
});
export type SectionFormValues = z.infer<typeof sectionFormSchema>;
export const defaultSectionFormValues: SectionFormValues = { name: "", capacity: "" };

export const subjectFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  code: z.string().trim().min(1, "Code is required."),
});
export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
export const defaultSubjectFormValues: SubjectFormValues = { name: "", code: "" };

export const assignFormSchema = z.object({
  teacherId: z.string().trim().min(1, "Select a teacher."),
  classId: z.string().trim().min(1, "Select a class."),
  sectionId: z.string().trim().min(1, "Select a section."),
  subjectId: z.string().trim().optional(),
  role: z.enum(["SUBJECT_TEACHER", "CLASS_TEACHER"]),
});
export type AssignFormValues = z.infer<typeof assignFormSchema>;
export const defaultAssignFormValues: AssignFormValues = {
  teacherId: "",
  classId: "",
  sectionId: "",
  subjectId: "",
  role: "SUBJECT_TEACHER",
};
