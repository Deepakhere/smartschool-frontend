import { PlusIcon } from "@heroicons/react/20/solid";

import type { Action } from "@/components/action-buttons";
import { useHeaderActions } from "@/components/section-header";
import DataTable from "@/components/data-table";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import FormDialog from "@/components/form-dialog";
import { SelectField } from "@/components/form-fields";
import { assignmentColumns, ROLE_OPTIONS } from "./assignments-tab-columns";
import useAssignmentsTabController from "./assignments-tab-controller";

const AssignmentsTab = ({ organizationId, yearId }: { organizationId: string; yearId: string }) => {
  const c = useAssignmentsTabController(organizationId, yearId);
  const addAction: Action = { label: "Assign teacher", icon: PlusIcon, onClick: c.openAssign, variant: "primary" };
  useHeaderActions({ action: { ...addAction, hidden: !yearId } });

  return (
    <div>
      <DataTable
        columns={assignmentColumns(c.askRemove)}
        data={c.items}
        getRowId={(item) => item.id}
        isLoading={c.isLoading}
        itemLabel="assignments"
        pagination={{ pageSize: 20 }}
        empty={{
          title: "No teachers assigned yet",
          description:
            "Assign teachers to the sections they teach, and choose each section's class teacher. Teachers see only the sections they are assigned to.",
        }}
      />

      <FormDialog
        form={c.form}
        open={c.open}
        onClose={c.closeAssign}
        title="Assign teacher"
        description="Choose where this teacher teaches. Only teachers of this school can be assigned."
        submitLabel="Assign"
        isSubmitting={c.isAssigning}
        onSubmit={c.submit}
      >
        <SelectField form={c.form} name="teacherId" label="Teacher" placeholder="Select teacher" options={c.teacherOptions} />
        <div className="grid grid-cols-2 gap-4">
          <SelectField form={c.form} name="classId" label="Class" placeholder="Select class" options={c.classOptions} />
          <SelectField
            form={c.form}
            name="sectionId"
            label="Section"
            placeholder="Select section"
            disabled={!c.classId}
            options={c.sectionOptions}
          />
        </div>
        <SelectField form={c.form} name="role" label="Role" options={ROLE_OPTIONS} />
        {c.role === "SUBJECT_TEACHER" && (
          <SelectField form={c.form} name="subjectId" label="Subject" placeholder="Select subject" options={c.subjectOptions} />
        )}
      </FormDialog>

      <DeleteConfirmationDialog
        open={!!c.toRemove}
        onClose={c.closeRemove}
        onConfirm={c.confirmRemove}
        isLoading={c.isRemoving}
        title="Remove this assignment?"
        description={
          c.toRemove
            ? `${c.toRemove.teacherUserId?.name} will no longer teach ${c.toRemove.classId?.name} ${c.toRemove.sectionId?.name}${
                c.toRemove.assignmentRole === "CLASS_TEACHER" ? " and will stop being its class teacher" : ""
              }.`
            : ""
        }
        confirmLabel="Remove"
      />
    </div>
  );
};

export default AssignmentsTab;
