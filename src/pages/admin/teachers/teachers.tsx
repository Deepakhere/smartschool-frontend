import DataTable from "@/components/data-table";
import ErrorState from "@/components/error-state";
import FormDialog from "@/components/form-dialog";
import { DateField, TextField } from "@/components/form-fields";
import SectionHeader from "@/components/section-header";
import { teacherColumns } from "./teachers-columns";
import useTeachersController from "./teachers-controller";

const AdminTeachers = () => {
  const c = useTeachersController();
  const isCodeLocked = !!c.editingTeacher?.staffProfile?.employeeCode;

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Teachers" description="Teacher directory and staff profiles" />

      {c.loadError ? (
        <ErrorState error={c.loadError} onRetry={c.retryLoad} />
      ) : (
        <DataTable
          columns={teacherColumns(c.openEdit)}
          data={c.teachers}
          getRowId={(teacher) => teacher.userId}
          isLoading={c.isLoading}
          itemLabel={{ one: "teacher", other: "teachers" }}
          pagination={{ pageSize: 20 }}
          empty={{
            title: "No teachers yet",
            description: "Invite teachers from Settings, User Management. They appear here once they join.",
          }}
        />
      )}

      <FormDialog
        form={c.form}
        open={!!c.editingTeacher}
        onClose={c.closeEdit}
        title={`Edit Staff Profile - ${c.editingTeacher?.name ?? ""}`}
        submitLabel="Save"
        isSubmitting={c.isSaving}
        onSubmit={c.submitProfile}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            form={c.form}
            name="employeeCode"
            label="Employee Code"
            disabled={isCodeLocked}
            description={isCodeLocked ? "Can't be changed once assigned." : undefined}
          />
          <DateField form={c.form} name="dateOfJoining" label="Date of Joining" />
        </div>
        <DateField
          form={c.form}
          name="dateOfBirth"
          label="Date of Birth"
          description="Shown as a birthday on the school calendar, to staff only."
        />
        <TextField form={c.form} name="designation" label="Designation" />
        <TextField form={c.form} name="department" label="Department" />
        <TextField form={c.form} name="qualification" label="Qualification" />
      </FormDialog>
    </div>
  );
};

export default AdminTeachers;
