import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useError } from "@/hooks";
import { IGradingScheme, SelectOption } from "@/types";
import { defaultExamValues, examSchema, ExamFormValues } from "../reports.schema";
import { useCreateExam } from "../service/exams-service";

interface CreateExamDialogControllerArgs {
  organizationId: string;
  academicYearId?: string;
  gradingSchemes: IGradingScheme[];
  open: boolean;
  onClose: () => void;
}

const useCreateExamDialogController = ({
  organizationId,
  academicYearId,
  gradingSchemes,
  open,
  onClose,
}: CreateExamDialogControllerArgs) => {
  const createExam = useCreateExam(organizationId);
  useError({ mutation: createExam });

  const form = useForm<ExamFormValues>({ resolver: zodResolver(examSchema), defaultValues: defaultExamValues });

  useEffect(() => {
    if (open) form.reset(defaultExamValues);
  }, [open, form]);

  const onSubmit = form.handleSubmit((values) => {
    if (!academicYearId) {
      toast.error("Set a current academic year first (Academics page).");
      return;
    }
    createExam.mutate(
      { ...values, academicYearId },
      {
        onSuccess: () => {
          toast.success("Exam created.");
          onClose();
        },
      }
    );
  });

  const gradingSchemeOptions: SelectOption[] = gradingSchemes.map((scheme) => ({ id: scheme.id, name: scheme.name }));

  return { form, onSubmit, isSubmitting: createExam.isPending, gradingSchemeOptions };
};

export default useCreateExamDialogController;
