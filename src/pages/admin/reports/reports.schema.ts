import { z } from "zod";

const percent = z
  .string()
  .trim()
  .min(1, "Required.")
  .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100, "Enter 0 to 100.");

export const gradingSchemeSchema = z.object({
  name: z.string().trim().min(1, "Enter a name."),
  passPercent: percent,
  bands: z
    .array(
      z.object({
        grade: z.string().trim().min(1, "Enter a grade."),
        minPercent: percent,
        maxPercent: percent,
        gradePoint: z.string().trim().min(1, "Required."),
      })
    )
    .min(1, "Add at least one band."),
});
export type GradingSchemeFormValues = z.infer<typeof gradingSchemeSchema>;
export const defaultGradingSchemeValues = (): GradingSchemeFormValues => ({
  name: "",
  passPercent: "33",
  bands: [{ grade: "", minPercent: "", maxPercent: "", gradePoint: "" }],
});

export const examSchema = z.object({
  name: z.string().trim().min(1, "Enter a name."),
  term: z.string().trim(),
  type: z.string().min(1),
  startDate: z.string().min(1, "Pick a start date."),
  endDate: z.string().min(1, "Pick an end date."),
  classIds: z.array(z.string()).min(1, "Pick at least one class."),
  gradingSchemeId: z.string().min(1, "Pick a grading scheme."),
});
export type ExamFormValues = z.infer<typeof examSchema>;
export const defaultExamValues: ExamFormValues = {
  name: "",
  term: "",
  type: "mid_term",
  startDate: "",
  endDate: "",
  classIds: [],
  gradingSchemeId: "",
};

export const examSubjectsSchema = z.object({
  classId: z.string().min(1, "Pick a class."),
  rows: z
    .array(
      z
        .object({
          subjectId: z.string().min(1, "Pick a subject."),
          maxMarks: z.string().trim().min(1, "Required."),
          passMarks: z.string().trim().min(1, "Required."),
          hasPractical: z.boolean(),
          practicalMaxMarks: z.string().trim(),
        })
        .refine((row) => !row.hasPractical || Number(row.practicalMaxMarks) > 0, {
          path: ["practicalMaxMarks"],
          message: "Enter the practical maximum.",
        })
    )
    .min(1, "Add at least one subject."),
});
export type ExamSubjectsFormValues = z.infer<typeof examSubjectsSchema>;
export const defaultExamSubjectRow = {
  subjectId: "",
  maxMarks: "100",
  passMarks: "33",
  hasPractical: false,
  practicalMaxMarks: "0",
};
export const defaultExamSubjectsValues = (classId = ""): ExamSubjectsFormValues => ({
  classId,
  rows: [{ ...defaultExamSubjectRow }],
});

export const marksRowSchema = z.object({
  studentId: z.string(),
  theoryMarks: z.string(),
  practicalMarks: z.string(),
  isAbsent: z.boolean(),
});
export const marksSheetSchema = z.object({ rows: z.array(marksRowSchema) });
export type MarksSheetFormValues = z.infer<typeof marksSheetSchema>;
