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

          {/* Academic Records section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Academic Records
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Performance, attendance, and achievements.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5">
              {/* Current Academic Year Overview */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Current Academic Year Overview
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Class</p>
                    <p className="font-medium">
                      {studentDetails?.classId || "VI"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Current Term</p>
                    <p className="font-medium">Term 1</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Session</p>
                    <p className="font-medium">2024-2025</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Total Subjects</p>
                    <p className="font-medium">6</p>
                  </div>
                </div>
              </div>

              {/* Subject-wise Performance */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Subject-wise Performance
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Subject
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Marks Obtained
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total Marks
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Grade
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          English
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          85
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          100
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          A
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Good progress
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Mathematics
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          78
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          100
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          B+
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Needs practice
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Science
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          92
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          100
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          A+
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Excellent
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Exam History */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Exam History
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Exam Name
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
                          Result Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total Marks
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Marks Scored
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Mid-Term
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          10/01/2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Passed
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          600
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          470
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          78.33%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Final Exam
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          25/03/2025
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Passed
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          600
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          510
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          85.00%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Attendance Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Total Working Days</p>
                    <p className="font-medium">180</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Present Days</p>
                    <p className="font-medium">160</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Absent Days</p>
                    <p className="font-medium">20</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Attendance %</p>
                    <p className="font-medium">88.88%</p>
                  </div>
                </div>
              </div>

              {/* Achievements / Awards */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Achievements / Awards
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  <li>Participated in Science Olympiad – Gold Medal</li>
                  <li>Won 2nd Prize in School Debate Competition</li>
                </ul>
              </div>
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
