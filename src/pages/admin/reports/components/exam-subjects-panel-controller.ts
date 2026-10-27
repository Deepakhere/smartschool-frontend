import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useError } from "@/hooks";
import { IExam, SelectOption } from "@/types";
import {
  defaultExamSubjectRow,
  defaultExamSubjectsValues,
  examSubjectsSchema,
  ExamSubjectsFormValues,
} from "../reports.schema";
import { useAddExamSubjects, useGetExamSubjects } from "../service/exams-service";

const useExamSubjectsPanelController = (organizationId: string, exam: IExam) => {
  const form = useForm<ExamSubjectsFormValues>({
    resolver: zodResolver(examSubjectsSchema),
    defaultValues: defaultExamSubjectsValues(exam.classIds[0]?.id),
  });
  const rows = useFieldArray({ control: form.control, name: "rows" });
  const classId = useWatch({ control: form.control, name: "classId" });

  const existingSubjects = useGetExamSubjects(organizationId, exam.id, classId);
  const addSubjects = useAddExamSubjects(organizationId);
  useError({ mutation: addSubjects });

  // switching the class resets the row list, since the subjects already saved for it differ
  useEffect(() => {
    rows.replace([{ ...defaultExamSubjectRow }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const onSubmit = form.handleSubmit((values) =>
    addSubjects.mutate(
      {
        examId: exam.id,
        classId: values.classId,
        subjects: values.rows.map((row) => ({
          subjectId: row.subjectId,
          maxMarks: Number(row.maxMarks),
          passMarks: Number(row.passMarks),
          hasPractical: row.hasPractical,
          practicalMaxMarks: row.hasPractical ? Number(row.practicalMaxMarks) : 0,
        })),
      },
      {
        onSuccess: () => {
          toast.success("Exam subjects saved.");
          rows.replace([{ ...defaultExamSubjectRow }]);
        },
      }
    )
  );

  const classOptions: SelectOption[] = exam.classIds.map((klass) => ({ id: klass.id, name: klass.name }));

  return {
    form,
    rows,
    classOptions,
    existingSubjects: existingSubjects.data?.items ?? [],
    isSaving: addSubjects.isPending,
    onSubmit,
  };
};

export default useExamSubjectsPanelController;
