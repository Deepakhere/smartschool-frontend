import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";

import { CheckboxField, SelectField, TextField } from "@/components/form-fields";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useError } from "@/hooks";
import { IExam, SelectOption } from "@/types";
import { defaultExamSubjectRow, defaultExamSubjectsValues, examSubjectsSchema, ExamSubjectsFormValues } from "../reports.schema";
import { useAddExamSubjects, useGetExamSubjects } from "../service/exams-service";

interface ExamSubjectsPanelProps {
  organizationId: string;
  exam: IExam;
  subjectOptions: SelectOption[];
}

const ExamSubjectsPanel = ({ organizationId, exam, subjectOptions }: ExamSubjectsPanelProps) => {
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

  return (
    <div className="mt-4 rounded-md bg-gray-50 p-4">
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate>
          <SelectField form={form} name="classId" label="Class" options={classOptions} className="max-w-xs" />

          <div className="mb-2 mt-4 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Add subjects</p>
            <Button variant="link" onClick={() => rows.append({ ...defaultExamSubjectRow })}>
              + Add row
            </Button>
          </div>
          <div className="space-y-2">
            {rows.fields.map((row, index) => (
              <div key={row.id} className="grid grid-cols-1 items-start gap-2 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <SelectField form={form} name={`rows.${index}.subjectId`} label="Subject" options={subjectOptions} />
                </div>
                <TextField form={form} name={`rows.${index}.maxMarks`} label="Max marks" type="number" />
                <TextField form={form} name={`rows.${index}.passMarks`} label="Pass marks" type="number" />
                <div className="flex items-end gap-2 pb-1">
                  <CheckboxField form={form} name={`rows.${index}.hasPractical`} label="Practical" />
                  {form.watch(`rows.${index}.hasPractical`) && (
                    <TextField form={form} name={`rows.${index}.practicalMaxMarks`} label="Practical max" type="number" min={1} />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:mt-6"
                  aria-label="Remove subject row"
                  disabled={rows.fields.length === 1}
                  onClick={() => rows.remove(index)}
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="submit" className="mt-3" loading={addSubjects.isPending}>
            Save subjects
          </Button>
        </form>
      </Form>

      {(existingSubjects.data?.items.length ?? 0) > 0 && (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableHead>Subject</TableHead>
              <TableHead className="text-center">Max Marks</TableHead>
              <TableHead className="text-center">Pass Marks</TableHead>
              <TableHead className="text-center">Practical</TableHead>
            </TableHeader>
            <TableBody>
              {existingSubjects.data?.items.map((es) => (
                <TableRow key={es.id}>
                  <TableCell className="font-medium text-gray-900">{typeof es.subjectId === "object" ? es.subjectId.name : ""}</TableCell>
                  <TableCell className="text-center">{es.maxMarks}</TableCell>
                  <TableCell className="text-center">{es.passMarks}</TableCell>
                  <TableCell className="text-center">{es.hasPractical ? `Yes (${es.practicalMaxMarks})` : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ExamSubjectsPanel;
