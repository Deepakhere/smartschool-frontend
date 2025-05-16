import {
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import LogoSpinner from "../../../../components/logo-spinner";
import NoRecordIcon from "../../../../icons/no-record-icon";

import useStudentsListController from "./students-list-controller";
import DeleteModal from "../../../../components/delete-modal";
import CreateUpdateStudentModal from "../student-modal/create-update-student-modal";

const StudentsList = () => {
  const {
    t,
    formData,
    studentDetail,
    isAddModalOpen,
    currentStep,
    isParentExist,
    studentTotalCount,
    handleSearchChange,
    CLASS_OPTIONS,
    indexOfLastItem,
    indexOfFirstItem,
    currentPage,
    itemsPerPage,
    searchTerm,
    classFilter,
    activeDropdown,
    dropdownRef,
    isDeleteModalOpen,
    deleteStudentId,
    isLoadingAddStudent,
    isLoadingGetStudentDetails,
    isLoadingUpdateStudent,
    isFetchingStudentList,
    handleChange,
    handleSubmit,
    setFormData,
    onCloseModal,
    nextStep,
    prevStep,
    setCurrentStep,
    onClickAddStudent,
    paginate,
    toggleDropdown,
    setSearchTerm,
    setActiveDropdown,
    setClassFilter,
    handleClassFilterChange,
    handleDeleteAction,
    handleDeleteStudent,
    onCancelDeleteModal,
    navigateToStudentDetails,
  } = useStudentsListController();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
          <button
            onClick={onClickAddStudent}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("labels.add_new_student")}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          {/* Search field */}
          <div className="flex">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t("messages.search")}
                onChange={(e) => {
                  e.preventDefault();
                  handleSearchChange(e.target.value);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="relative w-full sm:w-24">
              {studentTotalCount !== undefined && studentTotalCount > 0 ? (
                studentTotalCount > 1 ? (
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {studentTotalCount} {t("labels.records")}
                  </span>
                ) : (
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {studentTotalCount} {t("labels.record")}
                  </span>
                )
              ) : null}
            </div>
          </div>

          {/* Class filter */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="class-filter"
              className="block text-sm font-medium text-gray-700"
            >
              {t("labels.filter_by_class")}
            </label>
            <div className="relative w-full sm:w-48">
              <select
                value={classFilter}
                onChange={handleClassFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">{t("labels.all_classes")}</option>
                {CLASS_OPTIONS.map((classId) => (
                  <option key={classId} value={classId}>
                    {t("labels.class")} {classId}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="py-4">
          {isLoadingGetStudentDetails ? (
            <LogoSpinner />
          ) : (
            <>
              {/* Students Table */}
              <div className="bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("labels.student_name")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("labels.roll_number")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("labels.class_id")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("labels.date_of_birth")}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("labels.actions")}
                      </th>
                    </tr>
                  </thead>
                  {isFetchingStudentList ? (
                    <tbody>
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center">
                          <div className="flex justify-center items-center">
                            <div className="h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : studentDetail && studentDetail.length > 0 ? (
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentDetail.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div
                                  className="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer"
                                  onClick={() =>
                                    navigateToStudentDetails(student.id)
                                  }
                                >
                                  {student.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.classId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(student.dateOfBirth).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div
                              className="relative block text-center"
                              ref={dropdownRef}
                            >
                              <button
                                onClick={() => {
                                  toggleDropdown(student.id);
                                }}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-expanded={activeDropdown === student.id}
                                aria-haspopup="true"
                              >
                                <EllipsisHorizontalIcon className="h-5 w-5" />
                              </button>

                              {/* Dropdown menu with improved positioning */}
                              {activeDropdown === student.id && (
                                <div
                                  className="absolute right-0 top-full mt-1 w-32 bg-white border rounded-lg shadow-lg overflow-hidden z-50"
                                  role="menu"
                                  aria-orientation="vertical"
                                  aria-labelledby="options-menu"
                                >
                                  <div role="none">
                                    <button
                                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      role="menuitem"
                                      onMouseDown={() => {
                                        console.log("Edit student", student.id);
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      {t("buttons.edit")}
                                    </button>
                                    <button
                                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                      role="menuitem"
                                      onMouseDown={() => {
                                        handleDeleteAction(student.id);
                                        setActiveDropdown(null);
                                      }}
                                    >
                                      {t("buttons.delete")}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={4}>
                          <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                            <div className="mb-4">
                              <NoRecordIcon />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              {t("labels.no_records_found")}
                            </h3>
                            <p className="text-xs text-gray-500 mb-6 text-center max-w-md">
                              {searchTerm
                                ? `No student found matching "${searchTerm}". Try a different search term or clear the search.`
                                : `No student found with the selected filter. Try changing the filter or add a new user.`}
                            </p>
                            <button
                              onClick={() => {
                                setSearchTerm("");
                                setClassFilter("all");
                              }}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              {t("labels.clear_filters")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>

              {/* Pagination */}
              {studentDetail && studentDetail.length > 10 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        {t("labels.showing")}
                        <span className="font-medium">
                          {indexOfFirstItem + 1}
                        </span>
                        {t("labels.to")}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, studentDetail.length)}
                        </span>
                        {t("labels.of")}
                        <span className="font-medium">
                          {studentDetail.length}
                        </span>
                        {t("labels.results")}
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                            currentPage === 1
                              ? "cursor-not-allowed"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">
                            {t("labels.previous")}
                          </span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {/* Page numbers */}
                        {Array.from({
                          length: Math.ceil(
                            studentDetail.length / itemsPerPage
                          ),
                        }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              currentPage === index + 1
                                ? "bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            paginate(
                              Math.min(
                                Math.ceil(studentDetail.length / itemsPerPage),
                                currentPage + 1
                              )
                            )
                          }
                          disabled={
                            currentPage ===
                            Math.ceil(studentDetail.length / itemsPerPage)
                          }
                          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                            currentPage ===
                            Math.ceil(studentDetail.length / itemsPerPage)
                              ? "cursor-not-allowed"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">{t("labels.next")}</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      <CreateUpdateStudentModal
        t={t}
        isOpen={isAddModalOpen}
        formData={formData}
        isEditStudent={false}
        currentStep={currentStep}
        isParentExist={isParentExist}
        isLoadingAddStudent={isLoadingAddStudent}
        isLoadingUpdateStudent={isLoadingUpdateStudent}
        nextStep={nextStep}
        prevStep={prevStep}
        onClose={onCloseModal}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        setCurrentStep={setCurrentStep}
      />

      <DeleteModal
        t={t}
        isOpen={isDeleteModalOpen}
        name={
          studentDetail?.find((std) => std.id === deleteStudentId)?.name || ""
        }
        isLoading={false}
        onClose={onCancelDeleteModal}
        onConfirm={handleDeleteStudent}
      />
    </div>
  );
};

export default StudentsList;
