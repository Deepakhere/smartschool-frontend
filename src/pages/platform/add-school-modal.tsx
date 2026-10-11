import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormDialog from "@/components/form-dialog";
import { TextField } from "@/components/form-fields";
import { IAddOrganizationToAccountValue } from "@/types";
import { addSchoolSchema, AddSchoolFormValues } from "./add-school-modal.schema";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: IAddOrganizationToAccountValue) => void;
  isSubmitting: boolean;
}

const EMPTY: AddSchoolFormValues = { schoolName: "", address: "", pincode: "" };

const AddSchoolModal = ({ isOpen, onClose, onSubmit, isSubmitting }: AddSchoolModalProps) => {
  const form = useForm<AddSchoolFormValues>({ resolver: zodResolver(addSchoolSchema), defaultValues: EMPTY });

  useEffect(() => {
    if (isOpen) form.reset(EMPTY);
  }, [isOpen, form]);

  return (
    <FormDialog
      form={form}
      open={isOpen}
      onClose={onClose}
      title="Add School"
      description="The existing owner automatically gets admin access, no new invite needed."
      submitLabel="Add School"
      isSubmitting={isSubmitting}
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-md"
    >
      <TextField form={form} name="schoolName" label="School Name" autoFocus />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField form={form} name="address" label="Address" />
        <TextField form={form} name="pincode" label="Pincode" />
      </div>
    </FormDialog>
  );
};

export default AddSchoolModal;
