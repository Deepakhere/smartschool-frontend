import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import ErrorState from "@/components/error-state";
import NoRecordFound from "@/components/no-record-found";
import Spinner from "@/components/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Badge, BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useError } from "@/hooks";
import { SelectOption } from "@/types";
import { exportToCsv } from "@/utils";
import CustomSelectDropdown from "@/components/custom-select";
import { useGetSections } from "../../classes/service/academics-service";
import { useGetExams, useGetExamSubjects, useGetMarksSheet, useSaveMarks, useVerifyExamSubjectMarks } from "../service/exams-service";
import { marksSheetSchema, MarksSheetFormValues } from "../reports.schema";

const STATUS_TONE: Record<string, BadgeTone> = { published: "green", verified: "gray", marks_entry: "yellow", scheduled: "yellow" };

const MarksEntryTab = ({ organizationId }: { organizationId: string }) => {
  const { t } = useTranslation();
  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [examSubjectId, setExamSubjectId] = useState("");

  const exams = useGetExams(organizationId);
  const sections = useGetSections(organizationId, classId);
  const examSubjectsForMarks = useGetExamSubjects(organizationId, examId, classId);
  const marksSheet = useGetMarksSheet(organizationId, examSubjectId, sectionId);
  const saveMarks = useSaveMarks(organizationId);
  const verifyMarks = useVerifyExamSubjectMarks(organizationId);
  useError({ mutation: saveMarks });
  useError({ mutation: verifyMarks });

  const form = useForm<MarksSheetFormValues>({ resolver: zodResolver(marksSheetSchema), defaultValues: { rows: [] } });
  const rows = useFieldArray({ control: form.control, name: "rows" });
  const draftRows = useWatch({ control: form.control, name: "rows" });

  // the server sheet replaces the draft whenever the selection changes or a save/verify refetches it
  useEffect(() => {
    if (!marksSheet.data) return;
    rows.replace(
      marksSheet.data.items.map((item) => ({
        studentId: item.student.id,
        theoryMarks: String(item.marks?.theoryMarks ?? ""),
        practicalMarks: String(item.marks?.practicalMarks ?? ""),
        isAbsent: item.marks?.isAbsent ?? false,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marksSheet.data]);

  const exam = exams.data?.items.find((e) => e.id === examId);
  const examSubject = marksSheet.data?.examSubject;
  const marksLocked = exam?.status === "published";
  const marksByStudent = Object.fromEntries((marksSheet.data?.items ?? []).map((item) => [item.student.id, item]));

  const hasUnsavedMarks = draftRows.some((row) => {
    const item = marksByStudent[row.studentId];
    return (
      row.isAbsent !== (item?.marks?.isAbsent ?? false) ||
      row.theoryMarks !== String(item?.marks?.theoryMarks ?? "") ||
      row.practicalMarks !== String(item?.marks?.practicalMarks ?? "")
    );
  });

  // rows with nothing typed are left out rather than saved as 0: a student only gets marks once someone
  // enters them (or ticks absent). Marks above the maximum are caught here, before the server refuses the save.
  const onSave = form.handleSubmit((values) => {
    const practicalMax = examSubject?.hasPractical ? examSubject.practicalMaxMarks : 0;
    const problems: string[] = [];
    const entries = values.rows.flatMap((row) => {
      const student = marksByStudent[row.studentId]?.student;
      if (row.isAbsent) return [{ studentId: row.studentId, isAbsent: true }];
      if (row.theoryMarks.trim() === "" && row.practicalMarks.trim() === "") return [];

      const theory = Number(row.theoryMarks || 0);
      const practical = Number(row.practicalMarks || 0);
      if (!Number.isFinite(theory) || theory < 0 || (examSubject && theory > examSubject.maxMarks)) {
        problems.push(`${student?.name}: theory marks must be between 0 and ${examSubject?.maxMarks}.`);
      }
      if (!Number.isFinite(practical) || practical < 0 || practical > practicalMax) {
        problems.push(`${student?.name}: practical marks must be between 0 and ${practicalMax}.`);
      }
      return [{ studentId: row.studentId, theoryMarks: theory, practicalMarks: practical, isAbsent: false }];
    });

    if (problems.length) {
      toast.error(problems.slice(0, 3).join(" ") + (problems.length > 3 ? ` (and ${problems.length - 3} more)` : ""));
      return;
    }
    if (!entries.length) {
      toast.error("Enter marks for at least one student, or mark them absent.");
      return;
    }
    saveMarks.mutate({ examSubjectId, sectionId, entries }, { onSuccess: () => toast.success("Marks saved.") });
  });

  // verifying applies to what is saved, so unsaved edits must be saved first rather than silently dropped
  const onVerify = () => {
    if (hasUnsavedMarks) {
      toast.error("Save the marks first, then verify them.");
      return;
    }
    verifyMarks.mutate(examSubjectId, { onSuccess: () => toast.success("Marks verified.") });
  };

  const onExport = () =>
    exportToCsv(
      "marks-sheet",
      draftRows.map((row) => {
        const student = marksByStudent[row.studentId]?.student;
        return {
          student: student?.name ?? "",
          roll_number: student?.rollNumber ?? "",
          theory_marks: row.isAbsent ? "" : row.theoryMarks,
          practical_marks: row.isAbsent ? "" : row.practicalMarks,
          absent: row.isAbsent ? "Yes" : "No",
          status: marksByStudent[row.studentId]?.marks?.status ?? "",
        };
      })
    );

  const examOptions: SelectOption[] = (exams.data?.items ?? []).map((e) => ({ id: e.id, name: e.name }));
  const classOptions: SelectOption[] = (exam?.classIds ?? []).map((k) => ({ id: k.id, name: k.name }));
  const sectionOptions: SelectOption[] = (sections.data?.items ?? []).map((s) => ({ id: s.id, name: s.name }));
  const subjectOptions: SelectOption[] = (examSubjectsForMarks.data?.items ?? []).map((es) => ({
    id: es.id,
    name: typeof es.subjectId === "object" ? es.subjectId.name : "",
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle className="mb-4 font-medium">Select exam, class, section &amp; subject</CardTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <CustomSelectDropdown
            placeholder="Select exam"
            options={examOptions}
            value={examOptions.find((o) => o.id === examId) ?? null}
            onChange={(o) => {
              setExamId(String(o.id));
              setClassId("");
              setSectionId("");
              setExamSubjectId("");
            }}
          />
          <CustomSelectDropdown
            placeholder="Select class"
            disabled={!examId}
            options={classOptions}
            value={classOptions.find((o) => o.id === classId) ?? null}
            onChange={(o) => {
              setClassId(String(o.id));
              setSectionId("");
              setExamSubjectId("");
            }}
          />
          <CustomSelectDropdown
            placeholder="Select section"
            disabled={!classId}
            options={sectionOptions}
            value={sectionOptions.find((o) => o.id === sectionId) ?? null}
            onChange={(o) => setSectionId(String(o.id))}
          />
          <CustomSelectDropdown
            placeholder="Select subject"
            disabled={!classId}
            options={subjectOptions}
            value={subjectOptions.find((o) => o.id === examSubjectId) ?? null}
            onChange={(o) => setExamSubjectId(String(o.id))}
          />
        </div>
      </Card>

      {sectionId && examSubjectId && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle className="font-medium">Marks Sheet</CardTitle>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={onExport}>
                Export CSV
              </Button>
              {!marksLocked && (
                <>
                  <Button variant="secondary" size="sm" loading={verifyMarks.isPending} onClick={onVerify}>
                    Verify all
                  </Button>
                  <Button size="sm" loading={saveMarks.isPending} onClick={onSave}>
                    Save marks
                  </Button>
                </>
              )}
            </div>
          </div>

          {marksLocked && (
            <p className="mb-3 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
              Results for this exam are published, so these marks can no longer be changed.
            </p>
          )}
          {!marksLocked && hasUnsavedMarks && <p className="mb-3 text-sm text-amber-700">You have unsaved changes.</p>}

          {marksSheet.isError ? (
            <ErrorState error={marksSheet.error} onRetry={() => marksSheet.refetch()} />
          ) : marksSheet.isLoading ? (
            <Spinner />
          ) : rows.fields.length === 0 ? (
            <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Student</TableHead>
                <TableHead className="text-center">Theory</TableHead>
                <TableHead className="text-center">Practical</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableHeader>
              <TableBody>
                {rows.fields.map((row, index) => {
                  const item = marksByStudent[row.studentId];
                  const draft = draftRows[index];
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-gray-900">
                        {item?.student.name} <span className="text-xs text-gray-400">#{item?.student.rollNumber}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={examSubject?.maxMarks}
                          disabled={draft?.isAbsent || marksLocked}
                          className="w-20 text-center"
                          {...form.register(`rows.${index}.theoryMarks`)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min={0}
                          max={examSubject?.practicalMaxMarks}
                          disabled={draft?.isAbsent || marksLocked || !examSubject?.hasPractical}
                          placeholder={examSubject?.hasPractical ? "" : "-"}
                          className="w-20 text-center"
                          {...form.register(`rows.${index}.practicalMarks`)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox disabled={marksLocked} {...form.register(`rows.${index}.isAbsent`)} />
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.marks ? <Badge tone={STATUS_TONE[item.marks.status] ?? "gray"}>{item.marks.status}</Badge> : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      )}
    </div>
  );
};

export default MarksEntryTab;
