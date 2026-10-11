import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import FormDialog from "@/components/form-dialog";
import { ChipsField, DateField, SelectField, TextField } from "@/components/form-fields";
import { useError } from "@/hooks";
import { IGradingScheme, SelectOption } from "@/types";
import { defaultExamValues, examSchema, ExamFormValues } from "../reports.schema";
import { useCreateExam } from "../service/exams-service";

const typeOptions: SelectOption[] = [
  { id: "unit_test", name: "Unit Test" },
  { id: "mid_term", name: "Mid Term" },
  { id: "final", name: "Final" },
  { id: "other", name: "Other" },
];

interface CreateExamDialogProps {
  organizationId: string;
  academicYearId?: string;
  classOptions: SelectOption[];
  gradingSchemes: IGradingScheme[];
  open: boolean;
  onClose: () => void;
}

const CreateExamDialog = ({ organizationId, academicYearId, classOptions, gradingSchemes, open, onClose }: CreateExamDialogProps) => {
  const createExam = useCreateExam(organizationId);
  useError({ mutation: createExam });

  const form = useForm<ExamFormValues>({ resolver: zodResolver(examSchema), defaultValues: defaultExamValues });

  useEffect(() => {
    if (open) form.reset(defaultExamValues);
  }, [open, form]);

  const onSubmit = form.handleSubmit((values) => {
    if (!academicYearId) {
      toast.error("Set a current academic year first (Academics page).");
      return;
    }
    createExam.mutate(
      { ...values, academicYearId },
      {
        onSuccess: () => {
          toast.success("Exam created.");
          onClose();
        },
      }
    );
  });

  const gradingSchemeOptions: SelectOption[] = gradingSchemes.map((scheme) => ({ id: scheme.id, name: scheme.name }));

  return (
    <FormDialog
      form={form}
      open={open}
      onClose={onClose}
      title="Create Exam"
      submitLabel="Save"
      isSubmitting={createExam.isPending}
      onSubmit={onSubmit}
      className="max-w-2xl"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField form={form} name="name" label="Name" autoFocus />
        <TextField form={form} name="term" label="Term" />
        <SelectField form={form} name="type" label="Type" options={typeOptions} />
        <DateField form={form} name="startDate" label="Start Date" />
        <DateField form={form} name="endDate" label="End Date" />
        <SelectField form={form} name="gradingSchemeId" label="Grading Scheme" options={gradingSchemeOptions} placeholder="Select scheme" />
      </div>
      <ChipsField form={form} name="classIds" label="Classes" options={classOptions} />
    </FormDialog>
  );
};

export default CreateExamDialog;
