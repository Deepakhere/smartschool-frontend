import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useGetGradingSchemes,
  useCreateGradingScheme,
  useGetExams,
  useCreateExam,
  useAddExamSubjects,
  useGetExamSubjects,
  useGetMarksSheet,
  useSaveMarks,
  useVerifyExamSubjectMarks,
  usePublishExam,
} from "./service/exams-service";
import { useGetAcademicYears, useGetClasses, useGetSections, useGetSubjects } from "../classes/service/academics-service";
import { useError } from "../../../hooks";

export const useReportsController = () => {
  const { organizationId } = useParams();
  const org = organizationId || "";

  const [activeTab, setActiveTab] = useState<"schemes" | "exams" | "marks">("exams");

  // grading scheme form
  const [schemeName, setSchemeName] = useState("");
  const [passPercent, setPassPercent] = useState("33");
  const [bands, setBands] = useState([{ grade: "", minPercent: "", maxPercent: "", gradePoint: "" }]);

  // exam form
  const [showExamForm, setShowExamForm] = useState(false);
  const [examName, setExamName] = useState("");
  const [examTerm, setExamTerm] = useState("");
  const [examType, setExamType] = useState("mid_term");
  const [examStart, setExamStart] = useState("");
  const [examEnd, setExamEnd] = useState("");
  const [examClassIds, setExamClassIds] = useState<string[]>([]);
  const [examGradingSchemeId, setExamGradingSchemeId] = useState("");

  // exam subject management (per expanded exam)
  const [expandedExamId, setExpandedExamId] = useState("");
  const [subjectClassId, setSubjectClassId] = useState("");
  const [subjectRows, setSubjectRows] = useState([
    { subjectId: "", maxMarks: "100", passMarks: "33", hasPractical: false, practicalMaxMarks: "0" },
  ]);

  // marks entry
  const [marksExamId, setMarksExamId] = useState("");
  const [marksClassId, setMarksClassId] = useState("");
  const [marksSectionId, setMarksSectionId] = useState("");
  const [marksExamSubjectId, setMarksExamSubjectId] = useState("");
  const [marksDraft, setMarksDraft] = useState<
    Record<string, { theoryMarks: string; practicalMarks: string; isAbsent: boolean }>
  >({});

  const academicYears = useGetAcademicYears(org);
  const currentAcademicYearId = academicYears.data?.items.find((y) => y.isCurrent)?.id;
  const classes = useGetClasses(org, currentAcademicYearId);
  const subjects = useGetSubjects(org, currentAcademicYearId);
  const marksSections = useGetSections(org, marksClassId);

  const getGradingSchemes = useGetGradingSchemes(org);
  const createGradingScheme = useCreateGradingScheme(org);

  const getExams = useGetExams(org);
  const createExam = useCreateExam(org);
  const addExamSubjects = useAddExamSubjects(org);
  const getExamSubjectsForExpanded = useGetExamSubjects(org, expandedExamId);
  const publishExam = usePublishExam(org);

  const getExamSubjectsForMarks = useGetExamSubjects(org, marksExamId, marksClassId);
  const getMarksSheet = useGetMarksSheet(org, marksExamSubjectId, marksSectionId);
  const saveMarks = useSaveMarks(org);
  const verifyExamSubjectMarks = useVerifyExamSubjectMarks(org);

  useError({ mutation: createGradingScheme });
  useError({ mutation: createExam });
  useError({ mutation: addExamSubjects });
  useError({ mutation: saveMarks });
  useError({ mutation: verifyExamSubjectMarks });
  useError({ mutation: publishExam });

  const gradingSchemes = getGradingSchemes.data?.items || [];
  const exams = getExams.data?.items || [];
  const classOptions = classes.data?.items || [];
  const subjectOptions = subjects.data?.items || [];
  const sectionOptions = marksSections.data?.items || [];
  const examSubjectsForExpanded = getExamSubjectsForExpanded.data?.items || [];
  const examSubjectsForMarks = getExamSubjectsForMarks.data?.items || [];
  const marksSheet = getMarksSheet.data?.items || [];

  const addBandRow = () => setBands([...bands, { grade: "", minPercent: "", maxPercent: "", gradePoint: "" }]);
  const removeBandRow = (idx: number) => setBands(bands.filter((_, i) => i !== idx));
  const updateBandRow = (idx: number, field: string, value: string) => {
    setBands(bands.map((b, i) => (i === idx ? { ...b, [field]: value } : b)));
  };

  const handleCreateGradingScheme = () => {
    if (!schemeName || !bands.every((b) => b.grade && b.minPercent && b.maxPercent && b.gradePoint)) {
      toast.error("Fill in the scheme name and every band field.");
      return;
    }
    createGradingScheme.mutate(
      {
        name: schemeName,
        passPercent: Number(passPercent),
        bands: bands.map((b) => ({
          grade: b.grade,
          minPercent: Number(b.minPercent),
          maxPercent: Number(b.maxPercent),
          gradePoint: Number(b.gradePoint),
        })),
      },
      {
        onSuccess: () => {
          toast.success("Grading scheme created.");
          setSchemeName("");
          setPassPercent("33");
          setBands([{ grade: "", minPercent: "", maxPercent: "", gradePoint: "" }]);
        },
      }
    );
  };

  const toggleExamClass = (classId: string) => {
    setExamClassIds((prev) => (prev.includes(classId) ? prev.filter((c) => c !== classId) : [...prev, classId]));
  };

  const handleCreateExam = () => {
    if (!currentAcademicYearId || !examName || !examStart || !examEnd || !examClassIds.length || !examGradingSchemeId) {
      toast.error("Fill in name, dates, at least one class and a grading scheme.");
      return;
    }
    createExam.mutate(
      {
        academicYearId: currentAcademicYearId,
        name: examName,
        term: examTerm,
        type: examType,
        startDate: examStart,
        endDate: examEnd,
        classIds: examClassIds,
        gradingSchemeId: examGradingSchemeId,
      },
      {
        onSuccess: () => {
          toast.success("Exam created.");
          setShowExamForm(false);
          setExamName("");
          setExamTerm("");
          setExamStart("");
          setExamEnd("");
          setExamClassIds([]);
          setExamGradingSchemeId("");
        },
      }
    );
  };

  const toggleExpandExam = (examId: string, defaultClassId?: string) => {
    setExpandedExamId(expandedExamId === examId ? "" : examId);
    setSubjectClassId(defaultClassId || "");
  };

  const addSubjectRow = () =>
    setSubjectRows([...subjectRows, { subjectId: "", maxMarks: "100", passMarks: "33", hasPractical: false, practicalMaxMarks: "0" }]);
  const removeSubjectRow = (idx: number) => setSubjectRows(subjectRows.filter((_, i) => i !== idx));
  const updateSubjectRow = (idx: number, field: string, value: string | boolean) => {
    setSubjectRows(subjectRows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  const handleAddExamSubjects = () => {
    if (!subjectClassId || !subjectRows.every((r) => r.subjectId && r.maxMarks && r.passMarks)) {
      toast.error("Pick a class and fill every subject row.");
      return;
    }
    addExamSubjects.mutate(
      {
        examId: expandedExamId,
        classId: subjectClassId,
        subjects: subjectRows.map((r) => ({
          subjectId: r.subjectId,
          maxMarks: Number(r.maxMarks),
          passMarks: Number(r.passMarks),
          hasPractical: r.hasPractical,
          practicalMaxMarks: Number(r.practicalMaxMarks) || 0,
        })),
      },
      {
        onSuccess: () => {
          toast.success("Exam subjects saved.");
          setSubjectRows([{ subjectId: "", maxMarks: "100", passMarks: "33", hasPractical: false, practicalMaxMarks: "0" }]);
        },
      }
    );
  };

  const handlePublishExam = (examId: string) => {
    if (!window.confirm("Publish this exam? Results become visible to parents and marks lock permanently.")) return;
    publishExam.mutate(examId, {
      onSuccess: () => { toast.success("Results published."); },
    });
  };

  useEffect(() => {
    if (getMarksSheet.data) {
      const draft: typeof marksDraft = {};
      getMarksSheet.data.items.forEach((item) => {
        draft[item.student.id] = {
          theoryMarks: String(item.marks?.theoryMarks ?? ""),
          practicalMarks: String(item.marks?.practicalMarks ?? ""),
          isAbsent: item.marks?.isAbsent ?? false,
        };
      });
      setMarksDraft(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMarksSheet.data]);

  const updateMarksDraft = (studentId: string, field: string, value: string | boolean) => {
    setMarksDraft((prev) => {
      const current = prev[studentId] || { theoryMarks: "", practicalMarks: "", isAbsent: false };
      return { ...prev, [studentId]: { ...current, [field]: value } };
    });
  };

  const handleSaveMarks = () => {
    const entries = marksSheet.map((item) => {
      const draft = marksDraft[item.student.id] || { theoryMarks: "0", practicalMarks: "0", isAbsent: false };
      return {
        studentId: item.student.id,
        theoryMarks: Number(draft.theoryMarks) || 0,
        practicalMarks: Number(draft.practicalMarks) || 0,
        isAbsent: draft.isAbsent,
      };
    });
    saveMarks.mutate(
      { examSubjectId: marksExamSubjectId, sectionId: marksSectionId, entries },
      { onSuccess: () => { toast.success("Marks saved."); } }
    );
  };

  const handleVerifyMarks = () => {
    verifyExamSubjectMarks.mutate(marksExamSubjectId, {
      onSuccess: () => { toast.success("Marks verified."); },
    });
  };

  return {
    activeTab,
    setActiveTab,
    schemeName,
    setSchemeName,
    passPercent,
    setPassPercent,
    bands,
    addBandRow,
    removeBandRow,
    updateBandRow,
    handleCreateGradingScheme,
    isCreatingScheme: createGradingScheme.isLoading,
    gradingSchemes,
    isLoadingSchemes: getGradingSchemes.isLoading,

    showExamForm,
    setShowExamForm,
    examName,
    setExamName,
    examTerm,
    setExamTerm,
    examType,
    setExamType,
    examStart,
    setExamStart,
    examEnd,
    setExamEnd,
    examClassIds,
    toggleExamClass,
    examGradingSchemeId,
    setExamGradingSchemeId,
    handleCreateExam,
    isCreatingExam: createExam.isLoading,
    exams,
    isLoadingExams: getExams.isLoading,
    classOptions,
    subjectOptions,

    expandedExamId,
    toggleExpandExam,
    subjectClassId,
    setSubjectClassId,
    subjectRows,
    addSubjectRow,
    removeSubjectRow,
    updateSubjectRow,
    handleAddExamSubjects,
    isAddingSubjects: addExamSubjects.isLoading,
    examSubjectsForExpanded,
    handlePublishExam,
    isPublishing: publishExam.isLoading,

    marksExamId,
    setMarksExamId,
    marksClassId,
    setMarksClassId,
    marksSectionId,
    setMarksSectionId,
    marksExamSubjectId,
    setMarksExamSubjectId,
    sectionOptions,
    examSubjectsForMarks,
    marksSheet,
    isLoadingMarksSheet: getMarksSheet.isLoading,
    marksDraft,
    updateMarksDraft,
    handleSaveMarks,
    isSavingMarks: saveMarks.isLoading,
    handleVerifyMarks,
    isVerifyingMarks: verifyExamSubjectMarks.isLoading,
  };
};
