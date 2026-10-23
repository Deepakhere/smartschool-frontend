import { useState } from "react";

import { SelectOption } from "@/types";
import { useGetSections } from "../../classes/service/academics-service";
import { useGetExams, useGetExamSubjects } from "../service/exams-service";

const useMarksEntryTabController = (organizationId: string) => {
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

  // picking an exam or class clears everything chosen below it
  const selectExam = (id: string) => {
    setExamId(id);
    setClassId("");
    setSectionId("");
    setExamSubjectId("");
  };

  const selectClass = (id: string) => {
    setClassId(id);
    setSectionId("");
    setExamSubjectId("");
  };

  return {
    examId,
    classId,
    sectionId,
    examSubjectId,
    examOptions,
    classOptions,
    sectionOptions,
    subjectOptions,
    selectExam,
    selectClass,
    selectSection: setSectionId,
    selectSubject: setExamSubjectId,
    isSheetReady: !!(sectionId && examSubjectId),
    examPublished: exam?.status === "published",
  };
};

export default useMarksEntryTabController;
