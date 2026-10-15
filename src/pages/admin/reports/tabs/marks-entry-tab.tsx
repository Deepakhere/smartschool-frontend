import { useState } from "react";

import CustomSelectDropdown from "@/components/custom-select";
import { Card, CardTitle } from "@/components/ui/card";
import { SelectOption } from "@/types";
import { useGetSections } from "../../classes/service/academics-service";
import MarksSheetCard from "../components/marks-sheet-card";
import { useGetExams, useGetExamSubjects } from "../service/exams-service";
import EmptyState from "@/components/empty-state";

const MarksEntryTab = ({ organizationId }: { organizationId: string }) => {
  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [examSubjectId, setExamSubjectId] = useState("");

  const exams = useGetExams(organizationId);
  const sections = useGetSections(organizationId, classId);
  const examSubjectsForMarks = useGetExamSubjects(organizationId, examId, classId);

  const exam = exams.data?.items.find((e) => e.id === examId);

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

      {!(sectionId && examSubjectId) && (
        <Card>
          <EmptyState
            title={examOptions.length ? "Pick an exam, class, section and subject" : "No exams yet"}
            description={examOptions.length ? "The marks sheet for that paper opens here." : "Create an exam in the Exams tab, add its subjects, then enter marks here."}
          />
        </Card>
      )}

      {sectionId && examSubjectId && (
        <MarksSheetCard
          organizationId={organizationId}
          examSubjectId={examSubjectId}
          sectionId={sectionId}
          examPublished={exam?.status === "published"}
          canVerify
        />
      )}
    </div>
  );
};

export default MarksEntryTab;
