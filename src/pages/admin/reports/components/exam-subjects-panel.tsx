import { TrashIcon } from "@heroicons/react/24/outline";

import DataTable, { DataTableColumn } from "@/components/data-table";
import { CheckboxField, SelectField, TextField } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IExam, IExamSubject, SelectOption } from "@/types";
import { defaultExamSubjectRow } from "../reports.schema";
import useExamSubjectsPanelController from "./exam-subjects-panel-controller";

interface ExamSubjectsPanelProps {
  organizationId: string;
  exam: IExam;
  subjectOptions: SelectOption[];
}

const columns: DataTableColumn<IExamSubject>[] = [
  {
    id: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {typeof row.original.subjectId === "object" ? row.original.subjectId.name : ""}
      </span>
    ),
  },
  { id: "maxMarks", header: "Max Marks", meta: { align: "center" }, cell: ({ row }) => row.original.maxMarks },
  { id: "passMarks", header: "Pass Marks", meta: { align: "center" }, cell: ({ row }) => row.original.passMarks },
  {
    id: "practical",
    header: "Practical",
    meta: { align: "center" },
    cell: ({ row }) => (row.original.hasPractical ? `Yes (${row.original.practicalMaxMarks})` : "No"),
  },
];

const ExamSubjectsPanel = ({ organizationId, exam, subjectOptions }: ExamSubjectsPanelProps) => {
  const { form, rows, classOptions, existingSubjects, isSaving, onSubmit } = useExamSubjectsPanelController(
    organizationId,
    exam
  );

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
                    <TextField
                      form={form}
                      name={`rows.${index}.practicalMaxMarks`}
                      label="Practical max"
                      type="number"
                      min={1}
                    />
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
          <Button type="submit" className="mt-3" loading={isSaving}>
            Save subjects
          </Button>
        </form>
      </Form>

      {existingSubjects.length > 0 && (
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={existingSubjects}
            getRowId={(subject) => subject.id}
            empty={{ title: "No subjects yet" }}
          />
        </div>
      )}
    </div>
  );
};

export default ExamSubjectsPanel;
