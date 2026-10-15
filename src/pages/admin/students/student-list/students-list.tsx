import Pager from "@/components/pager";
import { useRef } from "react";
import toast from "react-hot-toast";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import NoRecordFound from "@/components/no-record-found";
import CustomSelectDropdown from "@/components/custom-select";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableSkeleton } from "@/components/table";
import { SelectOption } from "@/types";
import { usePageHeader } from "@/hooks";
import SectionHeader from "@/components/section-header";
import { exportToCsv } from "@/utils";

import useStudentsListController from "./students-list-controller";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import CreateUpdateStudentModal from "../student-modal/create-update-student-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BulkUploadModal from "../student-modal/bulk-upload-modal";
import RowMenu from "@/components/row-menu";
import { studentToCsvRow } from "../student-csv";

// the parent of this student, when they were invited but have not set a password yet
const pendingParent = (student: { parentId?: unknown }) => {
  const parent = student.parentId;
  return parent && typeof parent === "object" && (parent as { status?: string }).status === "pending"
    ? (parent as { id: string })
    : null;
};

const StudentsList = () => {
  const {
    t,
    organizationId,
    form,
    studentDetail,
    isAddModalOpen,
    isBulkModalOpen,
    onClickBulkUpload,
    onCloseBulkModal,
    onBulkImported,
    currentStep,
    isParentExist,
    studentTotalCount,
    handleSearchChange,
    searchInput,
    clearFilters,
    CLASS_OPTIONS,
    currentPage,
    itemsPerPage,
    searchTerm,
    classFilter,
    isDeleteModalOpen,
    deleteStudentId,
    isLoadingAddStudent,
    isLoadingGetStudentDetails,
    isLoadingUpdateStudent,
    isDeletingStudent,
    isFetchingStudentList,
    onSubmit,
    onCloseModal,
    nextStep,
    prevStep,
    setCurrentStep,
    onClickAddStudent,
    paginate,
    handleClassFilterChange,
    handleDeleteAction,
    handleDeleteStudent,
    handleResendInvite,
    onCancelDeleteModal,
    navigateToStudentDetails,
    onClickEditStudent,
  } = useStudentsListController();

  // the header keeps the buttons it was given on first render, so the export reads the list through a ref to
  // always get the students currently shown rather than the empty list from before they loaded
  const shownStudents = useRef(studentDetail);
  shownStudents.current = studentDetail;

  const handleExportCsv = () => {
    const rows = (shownStudents.current || []).map(studentToCsvRow);
    if (!rows.length) {
      toast.error("There are no students to export.");
      return;
    }
    exportToCsv("students", rows);
  };

  usePageHeader({
    actions: (
      <>
        <Button variant="secondary" onClick={handleExportCsv}>
          Export CSV
        </Button>
        <Button variant="secondary" onClick={onClickBulkUpload}>
          Bulk Upload (CSV)
        </Button>
        <Button onClick={onClickAddStudent}>{t("labels.add_new_student")}</Button>
      </>
    ),
  });

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Students" description="View, search and manage every enrolled student" />

      {/* Search and Filter Controls */}
      <div className="flex flex-row flex-wrap justify-between items-center mb-6 gap-4">
        {/* Search field + result count */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder={t("messages.search")}
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 leading-5"
            />
          </div>
          {studentTotalCount !== undefined && studentTotalCount > 0 && (
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {studentTotalCount} {t("labels.records")}
            </span>
          )}
        </div>

        {/* Class filter */}
        <div className="flex items-center gap-3">
          <Label htmlFor="class-filter" className="mb-0 whitespace-nowrap">
            {t("labels.filter_by_class")}
          </Label>
          <div className="w-full sm:w-48">
            <CustomSelectDropdown
              options={[
                { id: "all", name: t("labels.all_classes") } as SelectOption,
                ...CLASS_OPTIONS.map((klass) => ({ id: klass.id, name: klass.name })),
              ]}
              value={
                classFilter === "all"
                  ? { id: "all", name: t("labels.all_classes") }
                  : CLASS_OPTIONS.find((k) => k.id === classFilter)
                    ? { id: classFilter, name: CLASS_OPTIONS.find((k) => k.id === classFilter)!.name }
                    : { id: "all", name: t("labels.all_classes") }
              }
              onChange={(o) => handleClassFilterChange(String(o.id))}
            />
          </div>
        </div>
      </div>

      <div className="py-4">
        {isLoadingGetStudentDetails ? (
          <Table>
            <TableHeader>
              <TableHead>{t("labels.student_name")}</TableHead>
              <TableHead className="text-center">{t("labels.roll_number")}</TableHead>
              <TableHead className="text-center">{t("labels.class_id")}</TableHead>
              <TableHead className="text-center">{t("labels.date_of_birth")}</TableHead>
              <TableHead className="text-center">{t("labels.actions")}</TableHead>
            </TableHeader>
            <TableSkeleton columns={5} />
          </Table>
        ) : (
          <>
            {/* Students Table */}
            <Table>
              <TableHeader>
                <TableHead>{t("labels.student_name")}</TableHead>
                <TableHead className="text-center">{t("labels.roll_number")}</TableHead>
                <TableHead className="text-center">{t("labels.class_id")}</TableHead>
                <TableHead className="text-center">{t("labels.date_of_birth")}</TableHead>
                <TableHead className="text-center">{t("labels.actions")}</TableHead>
              </TableHeader>
              {isFetchingStudentList ? (
                <TableSkeleton columns={5} />
              ) : studentDetail && studentDetail.length > 0 ? (
                <TableBody>
                  {studentDetail.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">{student.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <Button
                              variant="link"
                              className="font-medium text-gray-900 hover:text-primary-600"
                              onClick={() => navigateToStudentDetails(student.id)}
                            >
                              {student.name}
                            </Button>
                            {pendingParent(student) && (
                              <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                {t("labels.invite_pending")}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{student.currentEnrollment?.rollNumber}</TableCell>
                      <TableCell className="text-center">
                        {student.currentEnrollment?.classId?.name}
                        {student.currentEnrollment?.sectionId?.name
                          ? ` - ${student.currentEnrollment.sectionId.name}`
                          : ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(student.dateOfBirth).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <RowMenu
                          items={[
                            { label: t("buttons.edit"), onSelect: () => onClickEditStudent(student.id) },
                            ...(pendingParent(student)
                              ? [{ label: t("buttons.resend_invite"), onSelect: () => handleResendInvite(pendingParent(student)!.id) }]
                              : []),
                            { label: t("buttons.delete"), onSelect: () => handleDeleteAction(student.id), danger: true },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <tr>
                    <td colSpan={5}>
                      <NoRecordFound
                        t={t}
                        searchTerm={searchTerm}
                        clearFilters={clearFilters}
                      />
                    </td>
                  </tr>
                </TableBody>
              )}
            </Table>

            <Pager page={currentPage} pageSize={itemsPerPage} total={studentTotalCount ?? 0} onPageChange={paginate} />
          </>
        )}
      </div>

      {/* Add Student Modal */}
      <CreateUpdateStudentModal
        t={t}
        isOpen={isAddModalOpen}
        organizationId={organizationId}
        form={form}
        isEditStudent={false}
        currentStep={currentStep}
        isParentExist={isParentExist}
        isLoadingAddStudent={isLoadingAddStudent}
        isLoadingUpdateStudent={isLoadingUpdateStudent}
        nextStep={nextStep}
        prevStep={prevStep}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        setCurrentStep={setCurrentStep}
      />

      <BulkUploadModal
        isOpen={isBulkModalOpen}
        organizationId={organizationId}
        onClose={onCloseBulkModal}
        onImported={onBulkImported}
      />

      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        title="Delete Student"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-medium italic text-gray-700">
              {studentDetail?.find((std) => std.id === deleteStudentId)?.name || "this student"}
            </span>
            ? This action cannot be undone.
          </>
        }
        isLoading={isDeletingStudent}
        onClose={onCancelDeleteModal}
        onConfirm={handleDeleteStudent}
      />
    </div>
  );
};

export default StudentsList;
