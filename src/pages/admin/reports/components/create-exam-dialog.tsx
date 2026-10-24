import FormDialog from "@/components/form-dialog";
import { ChipsField, DateField, SelectField, TextField } from "@/components/form-fields";
import { IGradingScheme, SelectOption } from "@/types";
import useCreateExamDialogController from "./create-exam-dialog-controller";

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
  const { form, onSubmit, isSubmitting, gradingSchemeOptions } = useCreateExamDialogController({
    organizationId,
    academicYearId,
    gradingSchemes,
    open,
    onClose,
  });

  return (
    <FormDialog
      form={form}
      open={open}
      onClose={onClose}
      title="Create Exam"
      submitLabel="Save"
      isSubmitting={isSubmitting}
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
