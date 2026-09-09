import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import DeleteConfirmationDialog from "../../../../components/delete-confirmation-dialog";
import CreateUpdateStudentModal from "../student-modal/create-update-student-modal";
import useStudentDetailController from "./student-detail-controller";
import PageLoader from "../../../../components/page-loader";
import Avatar from "../../../../components/avatar";
import GuardianModal from "./guardian-modal";
import { usePageHeader } from "../../../../hooks";

const StudentDetails = () => {
  const {
    t,
    organizationId,
    form,
    currentStep,
    updateStudent,
    isEditModalOpen,
    isDeleteModalOpen,
    isGuardianModalOpen,
    setIsGuardianModalOpen,
    studentDetails,
    isLoadingStudentDetail,
    isErrorStudentDetail,
    nextStep,
    prevStep,
    onBackClick,
    setCurrentStep,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    isDeletingStudent,
    handleDeleteStudent,
    onSubmit,
    addGuardian,
    handleSetPrimaryGuardian,
    handleRemoveGuardian,
    guardianIdPendingRemoval,
    isRemovingGuardian,
    cancelRemoveGuardian,
    confirmRemoveGuardian,
    enrollmentHistory,
    isLoadingEnrollmentHistory,
    isTransferModalOpen,
    setIsTransferModalOpen,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    confirmTransfer,
    confirmWithdraw,
    isTransferring,
    isWithdrawing,
    attendanceSummary,
    isLoadingAttendance,
    examResults,
    isLoadingExamResults,
  } = useStudentDetailController();

  const enrollmentStatusBadgeClass: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    PROMOTED: "bg-indigo-100 text-indigo-800",
    DETAINED: "bg-amber-100 text-amber-800",
    TRANSFERRED: "bg-gray-100 text-gray-600",
    WITHDRAWN: "bg-red-100 text-red-800",
  };

  usePageHeader({ title: "Student Profile", onBack: onBackClick });

  return (
    <>
      {isLoadingStudentDetail ? (
        <PageLoader />
      ) : isErrorStudentDetail ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Student not found</h2>
          <button
            onClick={onBackClick}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Students
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Student profile header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Avatar name={studentDetails?.name || ""} size={40} />
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{studentDetails?.name}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and information.</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>

            {/* Student information */}
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{studentDetails?.name}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Admission Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.admissionNumber}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Class</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.currentEnrollment?.classId?.name}
                    {studentDetails?.currentEnrollment?.sectionId?.name
                      ? ` - ${studentDetails.currentEnrollment.sectionId.name}`
                      : ""}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Roll Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.currentEnrollment?.rollNumber}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.dateOfBirth && new Date(studentDetails?.dateOfBirth).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.address}, {studentDetails?.city}, {studentDetails?.state}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Guardians */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Guardians</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Parents and guardians linked to this student.</p>
              </div>
              <button
                onClick={() => setIsGuardianModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                + Add Guardian
              </button>
            </div>
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {!studentDetails?.guardians?.length ? (
                <p className="px-4 py-5 text-sm text-gray-500">No guardians linked yet.</p>
              ) : (
                studentDetails.guardians.map((g) => (
                  <div key={g.id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {g.parentUserId?.name}{" "}
                        <span className="text-xs font-normal text-gray-500 capitalize">
                          ({g.relationshipType.toLowerCase()})
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        {g.parentUserId?.email} {g.parentUserId?.phoneNumber ? `· ${g.parentUserId.phoneNumber}` : ""}
                      </p>
                      <div className="mt-1 flex gap-2">
                        {g.isPrimaryGuardian && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                        {g.isEmergencyContact && (
                          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            Emergency contact
                          </span>
                        )}
                        {g.canPickup && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            Can pick up
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {!g.isPrimaryGuardian && (
                        <button
                          onClick={() => handleSetPrimaryGuardian(g.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Set as primary
                        </button>
                      )}
                      {!g.isPrimaryGuardian && (
                        <button
                          onClick={() => handleRemoveGuardian(g.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Enrollment Lifecycle */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Enrollment Lifecycle</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Transfer, withdraw, and year-over-year enrollment history.
                </p>
              </div>
              {studentDetails?.status === "active" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Transfer
                  </button>
                  <button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    Withdraw
                  </button>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {isLoadingEnrollmentHistory ? (
                <p className="px-4 py-5 text-sm text-gray-500">Loading history...</p>
              ) : enrollmentHistory.length === 0 ? (
                <p className="px-4 py-5 text-sm text-gray-500">No enrollment history yet.</p>
              ) : (
                enrollmentHistory.map((entry) => (
                  <div key={entry.id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {entry.academicYearId?.name || "-"} — {entry.classId?.name || "-"}
                        {entry.sectionId?.name ? ` - ${entry.sectionId.name}` : ""}
                        <span
                          className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full capitalize ${enrollmentStatusBadgeClass[entry.status]}`}
                        >
                          {entry.status.toLowerCase()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Roll No. {entry.rollNumber} · Joined {new Date(entry.joinedOn).toLocaleDateString()}
                        {entry.leftOn ? ` · Left ${new Date(entry.leftOn).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Academic Records section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Academic Records</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Exam results and attendance, from the school's real records.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5">
              {/* Current Enrollment Overview */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Current Enrollment</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Class</p>
                    <p className="font-medium">
                      {studentDetails?.currentEnrollment?.classId?.name || "-"}
                      {studentDetails?.currentEnrollment?.sectionId?.name
                        ? ` - ${studentDetails.currentEnrollment.sectionId.name}`
                        : ""}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Roll Number</p>
                    <p className="font-medium">{studentDetails?.currentEnrollment?.rollNumber || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="font-medium capitalize">{studentDetails?.status || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Exams Published</p>
                    <p className="font-medium">{examResults.length}</p>
                  </div>
                </div>
              </div>

              {/* Exam Results */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Exam Results</h4>
                {isLoadingExamResults ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : examResults.length === 0 ? (
                  <p className="text-sm text-gray-500">No published exam results yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Exam
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Result
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Marks
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Percentage
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {examResults.map((result) => {
                          const exam = typeof result.examId === "object" ? result.examId : null;
                          return (
                            <tr key={result.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam?.name || "-"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {exam?.startDate ? new Date(exam.startDate).toLocaleDateString() : "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                    result.promotionStatus === "pass"
                                      ? "bg-green-100 text-green-800"
                                      : result.promotionStatus === "fail"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {result.promotionStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.totals.obtained} / {result.totals.max}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.totals.percentage}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.grade || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Attendance Summary */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Attendance Summary</h4>
                {isLoadingAttendance ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : !attendanceSummary || attendanceSummary.total === 0 ? (
                  <p className="text-sm text-gray-500">No attendance recorded yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Total Marked Days</p>
                      <p className="font-medium">{attendanceSummary.total}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Present Days</p>
                      <p className="font-medium">{attendanceSummary.present}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Absent Days</p>
                      <p className="font-medium">{attendanceSummary.absent}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">Attendance %</p>
                      <p className="font-medium">
                        {((attendanceSummary.present / attendanceSummary.total) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Student Modal */}
          <CreateUpdateStudentModal
            t={t}
            isOpen={isEditModalOpen}
            organizationId={organizationId}
            form={form}
            isEditStudent={true}
            currentStep={currentStep}
            isParentExist={false}
            isLoadingAddStudent={false}
            isLoadingUpdateStudent={updateStudent.isPending}
            nextStep={nextStep}
            prevStep={prevStep}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={onSubmit}
            setCurrentStep={setCurrentStep}
          />

          <DeleteConfirmationDialog
            open={isDeleteModalOpen}
            title="Delete Student"
            description={
              <>
                Are you sure you want to delete{" "}
                <span className="font-medium italic text-gray-700">{studentDetails?.name || "this student"}</span>? This
                action cannot be undone.
              </>
            }
            isLoading={isDeletingStudent}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteStudent}
          />

          <DeleteConfirmationDialog
            open={!!guardianIdPendingRemoval}
            title="Remove Guardian"
            description="Are you sure you want to remove this guardian from the student? This action cannot be undone."
            confirmLabel="Remove"
            isLoading={isRemovingGuardian}
            onClose={cancelRemoveGuardian}
            onConfirm={confirmRemoveGuardian}
          />

          <DeleteConfirmationDialog
            open={isTransferModalOpen}
            title="Transfer Student"
            description="This marks the student as transferred out and closes their current enrollment. This action cannot be undone from here."
            confirmLabel="Transfer"
            isLoading={isTransferring}
            onClose={() => setIsTransferModalOpen(false)}
            onConfirm={confirmTransfer}
          />

          <DeleteConfirmationDialog
            open={isWithdrawModalOpen}
            title="Withdraw Student"
            description="This marks the student as withdrawn and closes their current enrollment. This action cannot be undone from here."
            confirmLabel="Withdraw"
            isLoading={isWithdrawing}
            onClose={() => setIsWithdrawModalOpen(false)}
            onConfirm={confirmWithdraw}
          />

          <GuardianModal
            isOpen={isGuardianModalOpen}
            isSubmitting={addGuardian.isPending}
            onClose={() => setIsGuardianModalOpen(false)}
            onSubmit={(value) => addGuardian.mutate(value)}
          />
        </div>
      )}
    </>
  );
};

export default StudentDetails;
