import { PlusIcon } from "@heroicons/react/20/solid";

import DataTable from "@/shared/ui/data-table";
import DeleteConfirmationDialog from "@/shared/ui/delete-confirmation-dialog";
import ErrorState from "@/shared/ui/error-state";
import FormDialog from "@/shared/ui/form-dialog";
import { CheckboxField, SelectField, TextField } from "@/shared/ui/form-fields";
import { SelectOption } from "@/shared/types";
import { feeHeadColumns } from "./fee-heads-columns";
import useFeeHeadsController from "./fee-heads-controller";

const categoryOptions: SelectOption[] = [
  { id: "tuition", name: "Tuition" },
  { id: "transport", name: "Transport" },
  { id: "hostel", name: "Hostel" },
  { id: "exam", name: "Exam" },
  { id: "misc", name: "Misc" },
];

const FeeHeadsTab = ({ organizationId }: { organizationId: string }) => {
  const c = useFeeHeadsController(organizationId);
  const { form, editForm, editing, retiring } = c;
  const columns = feeHeadColumns({ edit: c.openEdit, remove: c.setRetiring });

  return (
    <div className="space-y-6">
      <div>
        {c.isError ? (
          <ErrorState error={c.error} onRetry={c.retry} />
        ) : (
          <DataTable
            columns={columns}
            data={c.items}
            getRowId={(head) => head.id}
            isLoading={c.isLoading}
            itemLabel={{ one: "fee head", other: "fee heads" }}
            pagination={{ pageSize: 20 }}
            actions={[{ label: "New fee head", icon: PlusIcon, variant: "primary", onClick: c.openCreate }]}
            empty={{
              title: "No fee heads yet",
              description: "Add one, such as Tuition or Transport, to build fee structures from.",
            }}
          />
        )}
      </div>

      <FormDialog
        form={form}
        open={c.isCreateOpen}
        onClose={c.closeCreate}
        title="New fee head"
        description="A charge such as Tuition or Transport. Fee structures are built from these."
        submitLabel="Create"
        isSubmitting={c.isCreating}
        onSubmit={c.onSubmit}
      >
        <TextField form={form} name="name" label="Name" placeholder="Tuition fee" />
        <TextField form={form} name="code" label="Code" placeholder="TUI" />
        <SelectField form={form} name="category" label="Category" options={categoryOptions} />
        <CheckboxField form={form} name="isRefundable" label="Refundable" />
      </FormDialog>

      <FormDialog
        form={editForm}
        open={!!editing}
        onClose={c.closeEdit}
        title={`Edit ${editing?.name ?? "fee head"}`}
        description={`The code ${editing?.code ?? ""} stays the same, since receipts and structures refer to it.`}
        submitLabel="Save"
        isSubmitting={c.isUpdating}
        onSubmit={c.onEditSubmit}
      >
        <TextField form={editForm} name="name" label="Name" />
        <SelectField form={editForm} name="category" label="Category" options={categoryOptions} />
        <CheckboxField form={editForm} name="isRefundable" label="Refundable" />
      </FormDialog>

      <DeleteConfirmationDialog
        open={!!retiring}
        onClose={() => c.setRetiring(null)}
        onConfirm={c.onRetire}
        isLoading={c.isRetiring}
        title={`Remove ${retiring?.name ?? "this fee head"}?`}
        description="It won't be offered for new fee structures. Structures and student fees already using it stay as they are."
        confirmLabel="Remove"
      />
    </div>
  );
};

export default FeeHeadsTab;
