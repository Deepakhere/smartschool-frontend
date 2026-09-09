import { z } from "zod";

export const bulkUploadFormSchema = z.object({
  academicYearId: z.string().trim().min(1, "Select an academic year."),
  classId: z.string().trim().min(1, "Select a class."),
  sectionId: z.string().trim().min(1, "Select a section."),
  file: z.custom<File | null>((value) => value instanceof File, { message: "Choose a CSV file to upload." }),
});

export type BulkUploadFormValues = z.infer<typeof bulkUploadFormSchema>;

export const defaultBulkUploadFormValues = {
  academicYearId: "",
  classId: "",
  sectionId: "",
  file: null as File | null,
};
