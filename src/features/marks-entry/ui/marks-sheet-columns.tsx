import { FieldArrayWithId, UseFormReturn } from "react-hook-form";

import { DataTableColumn } from "@/shared/ui/data-table";
import { Badge, BadgeTone } from "@/shared/ui/kit/badge";
import { Checkbox } from "@/shared/ui/kit/checkbox";
import { Input } from "@/shared/ui/kit/input";
import { Label } from "@/shared/ui/kit/label";
import { IExamSubject, IMarksSheetItem } from "@/entities/exam";
import { MarksSheetFormValues } from "../model/marks-entry.schema";

const STATUS_TONE: Record<string, BadgeTone> = {
  published: "green",
  verified: "gray",
  marks_entry: "yellow",
  scheduled: "yellow",
};

export type MarksRow = FieldArrayWithId<MarksSheetFormValues, "rows", "id">;

interface MarksColumnOptions {
  form: UseFormReturn<MarksSheetFormValues>;
  draftRows: MarksSheetFormValues["rows"];
  examSubject?: IExamSubject;
  marksByStudent: Record<string, IMarksSheetItem>;
  examPublished: boolean;
  compact?: boolean;
}

// each cell registers its input by row index, so the grid stays bound to the react-hook-form field array
export const marksSheetColumns = (options: MarksColumnOptions): DataTableColumn<MarksRow>[] =>
  options.compact ? compactColumns(options) : wideColumns(options);

// below the desktop width each student is one row: name and status, then the mark boxes side by side
const compactColumns = ({
  form,
  draftRows,
  examSubject,
  marksByStudent,
  examPublished,
}: MarksColumnOptions): DataTableColumn<MarksRow>[] => [
  {
    id: "student",
    header: "Student",
    meta: { className: "w-full" },
    cell: ({ row }) => {
      const item = marksByStudent[row.original.studentId];
      const marks = item?.marks;
      const absent = draftRows[row.index]?.isAbsent;
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-gray-900">
              {item?.student.name} <span className="text-xs text-gray-400">#{item?.student.rollNumber}</span>
            </span>
            {marks && <Badge tone={STATUS_TONE[marks.status] ?? "gray"}>{marks.status}</Badge>}
          </div>
          <div className="flex items-end gap-3">
            <div className="w-24">
              <Label className="text-xs text-gray-500">Theory /{examSubject?.maxMarks}</Label>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                max={examSubject?.maxMarks}
                disabled={absent || examPublished}
                className="text-center"
                {...form.register(`rows.${row.index}.theoryMarks`)}
              />
            </div>
            {examSubject?.hasPractical && (
              <div className="w-24">
                <Label className="text-xs text-gray-500">Practical /{examSubject.practicalMaxMarks}</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={examSubject.practicalMaxMarks}
                  disabled={absent || examPublished}
                  className="text-center"
                  {...form.register(`rows.${row.index}.practicalMarks`)}
                />
              </div>
            )}
            <label className="ml-auto flex items-center gap-2 pb-2.5 text-sm text-gray-700">
              <Checkbox disabled={examPublished} {...form.register(`rows.${row.index}.isAbsent`)} />
              Absent
            </label>
          </div>
        </div>
      );
    },
  },
];

const wideColumns = ({
  form,
  draftRows,
  examSubject,
  marksByStudent,
  examPublished,
}: MarksColumnOptions): DataTableColumn<MarksRow>[] => [
  {
    id: "student",
    header: "Student",
    cell: ({ row }) => {
      const item = marksByStudent[row.original.studentId];
      return (
        <span className="font-medium text-gray-900">
          {item?.student.name} <span className="text-xs text-gray-400">#{item?.student.rollNumber}</span>
        </span>
      );
    },
  },
  {
    id: "theory",
    header: examSubject ? `Theory (max ${examSubject.maxMarks})` : "Theory",
    meta: { align: "center" },
    cell: ({ row }) => (
      <Input
        type="number"
        min={0}
        max={examSubject?.maxMarks}
        disabled={draftRows[row.index]?.isAbsent || examPublished}
        className="w-20 text-center"
        {...form.register(`rows.${row.index}.theoryMarks`)}
      />
    ),
  },
  {
    id: "practical",
    header: examSubject?.hasPractical ? `Practical (max ${examSubject.practicalMaxMarks})` : "Practical",
    meta: { align: "center" },
    cell: ({ row }) => (
      <Input
        type="number"
        min={0}
        max={examSubject?.practicalMaxMarks}
        disabled={draftRows[row.index]?.isAbsent || examPublished || !examSubject?.hasPractical}
        placeholder={examSubject?.hasPractical ? "" : "-"}
        className="w-20 text-center"
        {...form.register(`rows.${row.index}.practicalMarks`)}
      />
    ),
  },
  {
    id: "absent",
    header: "Absent",
    meta: { align: "center" },
    cell: ({ row }) => <Checkbox disabled={examPublished} {...form.register(`rows.${row.index}.isAbsent`)} />,
  },
  {
    id: "status",
    header: "Status",
    meta: { align: "center" },
    cell: ({ row }) => {
      const marks = marksByStudent[row.original.studentId]?.marks;
      return marks ? <Badge tone={STATUS_TONE[marks.status] ?? "gray"}>{marks.status}</Badge> : "-";
    },
  },
];
