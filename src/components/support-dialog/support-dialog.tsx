import FormDialog from "@/components/form-dialog";
import { FileField, SelectField, TextField, TextareaField } from "@/components/form-fields";
import { TOPIC_OPTIONS } from "@/pages/support";
import useSupportDialogController from "./support-dialog-controller";

const SupportDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { form, submit, isSending } = useSupportDialogController({ open, onClose });

  return (
    <FormDialog
      form={form}
      open={open}
      onClose={onClose}
      title="Contact Opscul support"
      description="Tell us what's wrong. We reply here and by email, usually within a working day."
      submitLabel="Send request"
      isSubmitting={isSending}
      onSubmit={submit}
    >
      <SelectField form={form} name="topic" label="Topic" options={TOPIC_OPTIONS} />
      <TextField form={form} name="subject" label="Subject" placeholder="e.g. Receipt not showing for a student" />
      <TextareaField form={form} name="body" label="What happened?" rows={5} placeholder="What you were doing, what you expected, and what happened instead" />
      <FileField form={form} name="screenshot" label="Screenshot (optional)" accept="image/png,image/jpeg" />
    </FormDialog>
  );
};

export default SupportDialog;
