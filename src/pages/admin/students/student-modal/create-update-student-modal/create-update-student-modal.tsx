import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { TOTAL_STEPS } from "@/utils";
import { ICreateUpdateStudentModalProps } from "@/types";
import StepIndicator from "@/components/step-indicator";
import StudentDetailsForm from "./student-details";
import ParentDetailsForm from "./parent-details";

const CreateUpdateStudentModal = ({
  t,
  isOpen,
  organizationId,
  form,
  isEditStudent,
  currentStep,
  isParentExist,
  isLoadingAddStudent,
  isLoadingUpdateStudent,
  onClose,
  nextStep,
  prevStep,
  onSubmit,
}: ICreateUpdateStudentModalProps) => {
  const isLoading = isEditStudent ? isLoadingUpdateStudent : isLoadingAddStudent;

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && !isLoading && onClose()}>
      <DialogContent
        showDefaultClose
        className="max-w-2xl"
        // a two-step form: a stray click outside must not throw the typed details away
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="overflow-y-auto p-6">
          <DialogTitle className="mb-4 text-lg font-medium text-gray-900">
            {isEditStudent ? t("labels.edit_student") : t("labels.add_new_student")}
          </DialogTitle>

          <StepIndicator currentStep={currentStep} />

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {currentStep === 1 && (
                <StudentDetailsForm t={t} organizationId={organizationId} form={form} isEditStudent={isEditStudent} />
              )}
              {currentStep === 2 && <ParentDetailsForm t={t} form={form} isParentExist={isParentExist} />}

              <div className="flex justify-end gap-3 pt-4">
                {currentStep > 1 && (
                  <Button variant="secondary" onClick={prevStep}>
                    {t("buttons.previous")}
                  </Button>
                )}

                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                  {t("buttons.cancel")}
                </Button>

                {currentStep < TOTAL_STEPS ? (
                  <Button
                    onClick={async (e) => {
                      e.preventDefault();
                      const fieldsToValidate =
                        currentStep === 1
                          ? ([
                              "admissionNumber",
                              "admissionDate",
                              "name",
                              "academicYearId",
                              "classId",
                              "sectionId",
                              "rollNumber",
                              "dateOfBirth",
                              "city",
                              "state",
                              "address",
                            ] as const)
                          : undefined;
                      const isValid = fieldsToValidate ? await form.trigger(fieldsToValidate) : true;
                      if (isValid) nextStep();
                    }}
                  >
                    {t("buttons.next")}
                  </Button>
                ) : (
                  <Button type="submit" loading={isLoading}>
                    {isEditStudent ? t("buttons.update_student") : t("buttons.add_student")}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateStudentModal;
