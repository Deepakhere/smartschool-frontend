
import ErrorState from "@/components/error-state";
import FormDialog from "@/components/form-dialog";
import { DateField, TextField } from "@/components/form-fields";
import EmptyState from "@/components/empty-state";
import SectionHeader from "@/components/section-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableSkeleton } from "@/components/table";
import { Button } from "@/components/ui/button";
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
        <div className="rounded-lg bg-white shadow">
          {c.isLoading ? (
            <Table>
              <TableHeader>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Employee Code</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableHeader>
              <TableSkeleton columns={6} />
            </Table>
          ) : c.teachers.length === 0 ? (
            <EmptyState title="No teachers yet" description="Invite teachers from Settings, User Management. They appear here once they join." />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Employee Code</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableHeader>
              <TableBody>
                {c.teachers.map((teacher) => (
                  <TableRow key={teacher.userId}>
                    <TableCell className="font-medium text-gray-900">{teacher.name}</TableCell>
                    <TableCell className="text-gray-500">{teacher.email}</TableCell>
                    <TableCell className="text-gray-500">{teacher.staffProfile?.employeeCode || "-"}</TableCell>
                    <TableCell className="text-gray-500">{teacher.staffProfile?.designation || "-"}</TableCell>
                    <TableCell className="text-gray-500">{teacher.staffProfile?.department || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" onClick={() => c.openEdit(teacher)}>
                        Edit profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
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
        <DateField form={c.form} name="dateOfBirth" label="Date of Birth" description="Shown as a birthday on the school calendar, to staff only." />
        <TextField form={c.form} name="designation" label="Designation" />
        <TextField form={c.form} name="department" label="Department" />
        <TextField form={c.form} name="qualification" label="Qualification" />
      </FormDialog>
    </div>
  );
};

export default AdminTeachers;
