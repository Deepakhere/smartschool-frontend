import { TOTAL_STEPS } from "../../../../../utils";
import { ICreateUpdateStudentModalProps } from "../../../../../types";
import StepIndicator from "../../../../../components/step-indicator";
import StudentDetailsForm from "./student-details";
import ParentDetailsForm from "./parent-details";
import Spinner from "../../../../../components/spinner";

const CreateUpdateStudentModal = ({
  t,
  isOpen,
  formData,
  isEditStudent,
  currentStep,
  isParentExist,
  isLoadingAddStudent,
  isLoadingUpdateStudent,
  onClose,
  nextStep,
  prevStep,
  handleSubmit,
  handleChange,
}: ICreateUpdateStudentModalProps) => {
  if (!isOpen) return null;

  const isLoading = isEditStudent
    ? isLoadingUpdateStudent
    : isLoadingAddStudent;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-lg font-medium mb-4">
          {isEditStudent
            ? t("labels.edit_student")
            : t("labels.add_new_student")}
        </h2>

        <StepIndicator currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <StudentDetailsForm
              t={t}
              formData={formData}
              handleChange={handleChange}
            />
          )}
          {currentStep === 2 && (
            <ParentDetailsForm
              t={t}
              formData={formData}
              isParentExist={isParentExist}
              handleChange={handleChange}
            />
          )}

          <div className="flex justify-end space-x-3 pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t("buttons.previous")}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t("buttons.cancel")}
            </button>

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t("buttons.next")}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading && <Spinner />}
                {isEditStudent
                  ? t("buttons.update_student")
                  : t("buttons.add_student")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUpdateStudentModal;
