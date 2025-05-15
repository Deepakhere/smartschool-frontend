import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import DeleteModal from "../../../../components/delete-modal";
import CreateUpdateStudentModal from "../student-modal/create-update-student-modal";
import useStudentDetailController from "./student-detail-controller";
import LogoSpinner from "../../../../components/logo-spinner";
import Avatar from "../../../../components/avatar";

const StudentDetails = () => {
  const {
    t,
    formData,
    currentStep,
    updateStudent,
    isEditModalOpen,
    isDeleteModalOpen,
    studentDetails,
    isLoadingStudentDetail,
    isErrorStudentDetail,
    setFormData,
    handleChange,
    nextStep,
    prevStep,
    onBackClick,
    setCurrentStep,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    handleDeleteStudent,
    handleSubmit,
  } = useStudentDetailController();

  return (
    <>
      {isLoadingStudentDetail ? (
        <div className="flex justify-center items-center h-screen">
          <LogoSpinner />
        </div>
      ) : isErrorStudentDetail ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Student not found
          </h2>
          <button
            onClick={onBackClick}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Students
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with back button */}
          <div className="mb-8">
            <button
              onClick={onBackClick}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Students List
            </button>
          </div>

          {/* Student profile header */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Avatar name={studentDetails?.name || ""} size={40} />
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Student Profile
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal details and information.
                  </p>
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
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Admission Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.admissionNumber}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Class</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.classId}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Roll Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.rollNumber}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.dateOfBirth &&
                      new Date(
                        studentDetails?.dateOfBirth
                      ).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.address}, {studentDetails?.city},{" "}
                    {studentDetails?.state}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Parent information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Parent Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Contact details of parent or guardian.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Parent Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.parentName}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.parentEmail}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Phone number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {studentDetails?.phoneNumber}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Academic Records section (can be expanded) */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Academic Records
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Attendance, grades, and other academic information.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5">
              <p className="text-sm text-gray-500 italic">
                Academic records will be displayed here.
              </p>
            </div>
          </div>

          {/* Edit Student Modal */}
          <CreateUpdateStudentModal
            t={t}
            isOpen={isEditModalOpen}
            formData={formData}
            isEditStudent={true}
            currentStep={currentStep}
            isParentExist={false}
            isLoadingAddStudent={false}
            isLoadingUpdateStudent={updateStudent.isLoading}
            nextStep={nextStep}
            prevStep={prevStep}
            onClose={() => setIsEditModalOpen(false)}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
          />

          {/* Delete Confirmation Modal */}
          <DeleteModal
            t={t}
            isOpen={isDeleteModalOpen}
            name={studentDetails?.name || ""}
            isLoading={false}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteStudent}
          />
        </div>
      )}
    </>
  );
};

export default StudentDetails;
