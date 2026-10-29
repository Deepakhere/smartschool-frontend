import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import FormDialog from "@/shared/ui/form-dialog";
import { CheckboxField, TextField } from "@/shared/ui/form-fields";
import { useError } from "@/shared/lib/hooks";
import { IExamOverviewSubject } from "@/entities/exam";
import { subjectMarksSchema, SubjectMarksFormValues } from "../../reports.schema";
import { useUpdateExamSubject } from "@/entities/exam";

interface EditSubjectDialogProps {
  organizationId: string;
  // the subject being edited; null = closed
  subject: IExamOverviewSubject | null;
  onClose: () => void;
}

const subjectName = (subject: IExamOverviewSubject | null) =>
  subject && typeof subject.subjectId === "object" ? subject.subjectId.name : "subject";

// a subject's marks; the server keeps any maximum from dropping below marks already given
const EditSubjectDialog = ({ organizationId, subject, onClose }: EditSubjectDialogProps) => {
  const updateSubject = useUpdateExamSubject(organizationId);
  useError({ mutation: updateSubject });
  const form = useForm<SubjectMarksFormValues>({ resolver: zodResolver(subjectMarksSchema) });

  useEffect(() => {
    if (subject) {
      form.reset({
        maxMarks: String(subject.maxMarks),
        passMarks: String(subject.passMarks),
        hasPractical: subject.hasPractical,
        practicalMaxMarks: subject.hasPractical ? String(subject.practicalMaxMarks) : "",
      });
    }
  }, [subject, form]);

  const onSubmit = form.handleSubmit((values) => {
    if (!subject) return;
    updateSubject.mutate(
      {
        examSubjectId: subject.id,
        maxMarks: Number(values.maxMarks),
        passMarks: Number(values.passMarks),
        hasPractical: values.hasPractical,
        practicalMaxMarks: values.hasPractical ? Number(values.practicalMaxMarks) : 0,
      },
      {
        onSuccess: () => {
          toast.success("Subject updated.");
          onClose();
        },
      }
    );
  });

  return (
    <FormDialog
      form={form}
      open={!!subject}
      onClose={onClose}
      title={`Edit ${subjectName(subject)}`}
      description={
        subject?.entered
          ? "Marks are already entered, so a maximum can't go below the highest mark given."
          : "Change the maximum and pass marks for this paper."
      }
      submitLabel="Save changes"
      isSubmitting={updateSubject.isPending}
      onSubmit={onSubmit}
      className="max-w-md"
    >
      <div className="grid grid-cols-2 gap-4">
        <TextField form={form} name="maxMarks" label="Max marks" type="number" min={1} autoFocus />
        <TextField form={form} name="passMarks" label="Pass marks" type="number" min={0} />
      </div>
      <CheckboxField form={form} name="hasPractical" label="Has a practical" />
      {form.watch("hasPractical") && (
        <TextField form={form} name="practicalMaxMarks" label="Practical max marks" type="number" min={1} />
      )}
    </FormDialog>
  );
};

export default EditSubjectDialog;
