import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormDialog from "@/components/form-dialog";
import { TextField } from "@/components/form-fields";
import { ICreateAccountValue } from "@/types";
import { createAccountSchema, CreateAccountFormValues } from "./create-account-modal.schema";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: ICreateAccountValue) => void;
  isSubmitting: boolean;
}

const EMPTY: CreateAccountFormValues = {
  accountName: "",
  ownerEmail: "",
  ownerName: "",
  schoolName: "",
  address: "",
  pincode: "",
};

const CreateAccountModal = ({ isOpen, onClose, onSubmit, isSubmitting }: CreateAccountModalProps) => {
  const form = useForm<CreateAccountFormValues>({ resolver: zodResolver(createAccountSchema), defaultValues: EMPTY });

  useEffect(() => {
    if (isOpen) form.reset(EMPTY);
  }, [isOpen, form]);

  return (
    <FormDialog
      form={form}
      open={isOpen}
      onClose={onClose}
      title="New Customer"
      description="Creates the customer account and their first school. The owner is invited by email if they don't already have a login."
      submitLabel="Create Customer"
      isSubmitting={isSubmitting}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <TextField form={form} name="accountName" label="Customer / Account Name" autoFocus />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField form={form} name="ownerName" label="Owner Name" />
        <TextField form={form} name="ownerEmail" label="Owner Email" type="email" />
      </div>
      <div className="border-t border-gray-100 pt-4">
        <TextField form={form} name="schoolName" label="First School Name" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField form={form} name="address" label="Address" />
        <TextField form={form} name="pincode" label="Pincode" />
      </div>
    </FormDialog>
  );
};

export default CreateAccountModal;
