import { z } from "zod";

const today = () => new Date().toISOString().slice(0, 10);

export const homeworkFormSchema = z.object({
  subjectId: z.string().trim().min(1, "Select a subject."),
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().min(1, "Description is required."),
  assignedDate: z.string().trim().min(1, "Assigned date is required."),
  dueDate: z.string().trim().min(1, "Due date is required."),
  attachment: z.instanceof(File).nullable(),
});

export type HomeworkFormValues = z.infer<typeof homeworkFormSchema>;

export const defaultHomeworkFormValues: HomeworkFormValues = {
  subjectId: "",
  title: "",
  description: "",
  assignedDate: today(),
  dueDate: "",
  attachment: null,
};
