import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ErrorState from "@/components/error-state";
import FormDialog from "@/components/form-dialog";
import RowMenu from "@/components/row-menu";
import { CheckboxField, SelectField, TextField } from "@/components/form-fields";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow, TableSkeleton } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useError } from "@/hooks";
import { IFeeHead, SelectOption } from "@/types";
import { defaultFeeHeadValues, feeHeadEditSchema, FeeHeadEditValues, feeHeadSchema, FeeHeadFormValues } from "../fees.schema";
import { useCreateFeeHead, useDeactivateFeeHead, useGetFeeHeads, useUpdateFeeHead } from "../service/fees-service";

const categoryOptions: SelectOption[] = [
  { id: "tuition", name: "Tuition" },
  { id: "transport", name: "Transport" },
  { id: "hostel", name: "Hostel" },
  { id: "exam", name: "Exam" },
  { id: "misc", name: "Misc" },
];

const FeeHeadsTab = ({ organizationId }: { organizationId: string }) => {
  const feeHeads = useGetFeeHeads(organizationId);
  const createFeeHead = useCreateFeeHead(organizationId);
  const updateFeeHead = useUpdateFeeHead(organizationId);
  const deactivateFeeHead = useDeactivateFeeHead(organizationId);
  useError({ mutation: createFeeHead });
  useError({ mutation: updateFeeHead });
  useError({ mutation: deactivateFeeHead });

  const form = useForm<FeeHeadFormValues>({ resolver: zodResolver(feeHeadSchema), defaultValues: defaultFeeHeadValues });
  const editForm = useForm<FeeHeadEditValues>({ resolver: zodResolver(feeHeadEditSchema), defaultValues: { name: "", category: "tuition", isRefundable: false } });
  const [editing, setEditing] = useState<IFeeHead | null>(null);
  const [retiring, setRetiring] = useState<IFeeHead | null>(null);

  const openEdit = (head: IFeeHead) => {
    editForm.reset({ name: head.name, category: head.category || "misc", isRefundable: head.isRefundable });
    setEditing(head);
  };

  const onEditSubmit = editForm.handleSubmit((value) => {
    if (!editing) return;
    updateFeeHead.mutate(
      { feeHeadId: editing.id, value },
      {
        onSuccess: () => {
          toast.success("Fee head updated.");
          setEditing(null);
        },
      }
    );
  });

  const onRetire = () => {
    if (!retiring) return;
    deactivateFeeHead.mutate(retiring.id, {
      onSuccess: () => {
        toast.success(`${retiring.name} removed. Structures already using it are unchanged.`);
        setRetiring(null);
      },
    });
  };

  const onSubmit = form.handleSubmit((values) =>
    createFeeHead.mutate(values, {
      onSuccess: () => {
        toast.success("Fee head created.");
        form.reset(defaultFeeHeadValues);
      },
    })
  );

  const items = feeHeads.data?.items ?? [];

  return (
    <Card>
      <CardTitle className="mb-4 font-medium">Create Fee Head</CardTitle>
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 items-start gap-3 sm:grid-cols-4">
          <TextField form={form} name="name" label="Name" placeholder="Tuition fee" />
          <TextField form={form} name="code" label="Code" placeholder="TUI" />
          <SelectField form={form} name="category" label="Category" options={categoryOptions} />
          <div className="flex items-center justify-between gap-3 sm:mt-6">
            <CheckboxField form={form} name="isRefundable" label="Refundable" />
            <Button type="submit" loading={createFeeHead.isPending}>
              Add
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6">
        {feeHeads.isError ? (
          <ErrorState error={feeHeads.error} onRetry={() => feeHeads.refetch()} />
        ) : feeHeads.isLoading ? (
          <Table>
            <TableHeader>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Code</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Refundable</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableHeader>
            <TableSkeleton columns={5} />
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Code</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Refundable</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableEmpty colSpan={5} title="No fee heads yet" description="Add one above, such as Tuition or Transport, to build fee structures from." />
              ) : (
                items.map((head) => (
                  <TableRow key={head.id}>
                    <TableCell className="font-medium text-gray-900">{head.name}</TableCell>
                    <TableCell className="text-center">{head.code}</TableCell>
                    <TableCell className="text-center capitalize">{head.category}</TableCell>
                    <TableCell className="text-center">{head.isRefundable ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-center">
                      <RowMenu
                        items={[
                          { label: "Edit", onSelect: () => openEdit(head) },
                          { label: "Remove", onSelect: () => setRetiring(head), danger: true },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <FormDialog
        form={editForm}
        open={!!editing}
        onClose={() => setEditing(null)}
        title={`Edit ${editing?.name ?? "fee head"}`}
        description={`The code ${editing?.code ?? ""} stays the same, since receipts and structures refer to it.`}
        submitLabel="Save"
        isSubmitting={updateFeeHead.isPending}
        onSubmit={onEditSubmit}
      >
        <TextField form={editForm} name="name" label="Name" />
        <SelectField form={editForm} name="category" label="Category" options={categoryOptions} />
        <CheckboxField form={editForm} name="isRefundable" label="Refundable" />
      </FormDialog>

      <DeleteConfirmationDialog
        open={!!retiring}
        onClose={() => setRetiring(null)}
        onConfirm={onRetire}
        isLoading={deactivateFeeHead.isPending}
        title={`Remove ${retiring?.name ?? "this fee head"}?`}
        description="It won't be offered for new fee structures. Structures and student fees already using it stay as they are."
        confirmLabel="Remove"
      />
    </Card>
  );
};

export default FeeHeadsTab;
