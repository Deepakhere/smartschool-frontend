import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormDialog from "@/components/form-dialog";
import { CheckboxField, SelectField, TextField } from "@/components/form-fields";
import { IAddGuardianValue, SelectOption } from "@/types";
import { guardianFormSchema, defaultGuardianFormValues, GuardianFormValues } from "./guardian-modal.schema";

const relationshipOptions: SelectOption[] = [
  { id: "FATHER", name: "Father" },
  { id: "MOTHER", name: "Mother" },
  { id: "GUARDIAN", name: "Guardian" },
  { id: "OTHER", name: "Other" },
];

interface GuardianModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (value: IAddGuardianValue) => void;
}

const GuardianModal = ({ isOpen, isSubmitting, onClose, onSubmit }: GuardianModalProps) => {
  const form = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianFormSchema),
    defaultValues: defaultGuardianFormValues,
  });

  // every opening starts empty, never with the guardian added (or abandoned) last time
  useEffect(() => {
    if (isOpen) form.reset(defaultGuardianFormValues);
  }, [isOpen, form]);

  return (
    <FormDialog
      form={form}
      open={isOpen}
      onClose={onClose}
      title="Add Guardian"
      submitLabel="Save"
      isSubmitting={isSubmitting}
      onSubmit={form.handleSubmit((values) => onSubmit(values))}
    >
      <TextField form={form} name="parentEmail" label="Email" type="email" autoFocus />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField form={form} name="parentName" label="Name" />
        <TextField form={form} name="phoneNumber" label="Phone" />
      </div>
      <SelectField form={form} name="relationshipType" label="Relationship" options={relationshipOptions} />
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <CheckboxField form={form} name="isPrimaryGuardian" label="Primary guardian" />
        <CheckboxField form={form} name="isEmergencyContact" label="Emergency contact" />
        <CheckboxField form={form} name="canPickup" label="Can pick up" />
      </div>
    </FormDialog>
  );
};

export default GuardianModal;
