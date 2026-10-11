import { useTranslation } from "react-i18next";

import ErrorState from "@/components/error-state";
import FormDialog from "@/components/form-dialog";
import { DateField, TextField } from "@/components/form-fields";
import NoRecordFound from "@/components/no-record-found";
import SectionHeader from "@/components/section-header";
import Spinner from "@/components/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/ui/button";
import useTeachersController from "./teachers-controller";

const AdminTeachers = () => {
  const { t } = useTranslation();
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
            <Spinner />
          ) : c.teachers.length === 0 ? (
            <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
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
        <TextField form={c.form} name="designation" label="Designation" />
        <TextField form={c.form} name="department" label="Department" />
        <TextField form={c.form} name="qualification" label="Qualification" />
      </FormDialog>
    </div>
  );
};

export default AdminTeachers;
