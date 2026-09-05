import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  useGetAcademicYears,
  useCreateAcademicYear,
  useGetClasses,
  useCreateClass,
  useGetSections,
  useCreateSection,
  useGetSubjects,
  useCreateSubject,
  useGetTeacherAssignments,
  useAssignTeacher,
} from "./service/academics-service";
import { useGetAllTeachers } from "./service/teachers-service";

type Tab = "years" | "classes" | "sections" | "subjects" | "teachers";

const useClassesController = () => {
  const { organizationId = "" } = useParams();

  const [activeTab, setActiveTab] = useState<Tab>("years");
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  const academicYears = useGetAcademicYears(organizationId);
  const classes = useGetClasses(organizationId, selectedAcademicYearId);
  const sections = useGetSections(organizationId, selectedClassId);
  const subjects = useGetSubjects(organizationId, selectedAcademicYearId);
  const teachers = useGetAllTeachers(organizationId);
  const teacherAssignments = useGetTeacherAssignments(organizationId);

  useEffect(() => {
    if (!selectedAcademicYearId && academicYears.data?.items.length) {
      const current = academicYears.data.items.find((y) => y.isCurrent);
      setSelectedAcademicYearId((current || academicYears.data.items[0]).id);
    }
  }, [academicYears.data, selectedAcademicYearId]);

  useEffect(() => {
    if (!selectedClassId && classes.data?.items.length) {
      setSelectedClassId(classes.data.items[0].id);
    }
  }, [classes.data, selectedClassId]);

  // academic year form
  const [showYearForm, setShowYearForm] = useState(false);
  const [yearName, setYearName] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [yearIsCurrent, setYearIsCurrent] = useState(false);
  const createAcademicYear = useCreateAcademicYear(organizationId);

  const submitYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yearName || !yearStart || !yearEnd) {
      toast.error("Please fill all required fields");
      return;
    }
    createAcademicYear.mutate({ name: yearName, startDate: yearStart, endDate: yearEnd, isCurrent: yearIsCurrent });
  };

  useEffect(() => {
    if (createAcademicYear.isSuccess) {
      toast.success("Academic year created");
      setShowYearForm(false);
      setYearName("");
      setYearStart("");
      setYearEnd("");
      setYearIsCurrent(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAcademicYear.isSuccess]);

  // class form
  const [showClassForm, setShowClassForm] = useState(false);
  const [className, setClassName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const createClass = useCreateClass(organizationId);

  const submitClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className || !selectedAcademicYearId) {
      toast.error("Please fill all required fields");
      return;
    }
    createClass.mutate({
      name: className,
      academicYearId: selectedAcademicYearId,
      numericLevel: classLevel ? Number(classLevel) : undefined,
    });
  };

  useEffect(() => {
    if (createClass.isSuccess) {
      toast.success("Class created");
      setShowClassForm(false);
      setClassName("");
      setClassLevel("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createClass.isSuccess]);

  // section form
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [sectionCapacity, setSectionCapacity] = useState("");
  const createSection = useCreateSection(organizationId);

  const submitSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName || !selectedClassId || !selectedAcademicYearId) {
      toast.error("Please fill all required fields");
      return;
    }
    createSection.mutate({
      name: sectionName,
      classId: selectedClassId,
      academicYearId: selectedAcademicYearId,
      capacity: sectionCapacity ? Number(sectionCapacity) : undefined,
    });
  };

  useEffect(() => {
    if (createSection.isSuccess) {
      toast.success("Section created");
      setShowSectionForm(false);
      setSectionName("");
      setSectionCapacity("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSection.isSuccess]);

  // subject form
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const createSubject = useCreateSubject(organizationId);

  const submitSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || !subjectCode || !selectedAcademicYearId) {
      toast.error("Please fill all required fields");
      return;
    }
    createSubject.mutate({ name: subjectName, code: subjectCode, academicYearId: selectedAcademicYearId });
  };

  useEffect(() => {
    if (createSubject.isSuccess) {
      toast.success("Subject created");
      setShowSubjectForm(false);
      setSubjectName("");
      setSubjectCode("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSubject.isSuccess]);

  // teacher assignment form
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignTeacherId, setAssignTeacherId] = useState("");
  const [assignClassId, setAssignClassId] = useState("");
  const [assignSectionId, setAssignSectionId] = useState("");
  const [assignSubjectId, setAssignSubjectId] = useState("");
  const [assignRole, setAssignRole] = useState<"SUBJECT_TEACHER" | "CLASS_TEACHER">("SUBJECT_TEACHER");
  const assignSections = useGetSections(organizationId, assignClassId);
  const assignTeacher = useAssignTeacher(organizationId);

  useEffect(() => {
    setAssignSectionId("");
  }, [assignClassId]);

  const submitAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTeacherId || !assignClassId || !assignSectionId || !selectedAcademicYearId) {
      toast.error("Please fill all required fields");
      return;
    }
    assignTeacher.mutate({
      teacherUserId: assignTeacherId,
      academicYearId: selectedAcademicYearId,
      classId: assignClassId,
      sectionId: assignSectionId,
      subjectId: assignRole === "SUBJECT_TEACHER" ? assignSubjectId : undefined,
      assignmentRole: assignRole,
    });
  };

  useEffect(() => {
    if (assignTeacher.isSuccess) {
      toast.success("Teacher assigned");
      setShowAssignForm(false);
      setAssignTeacherId("");
      setAssignSubjectId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignTeacher.isSuccess]);

  return {
    activeTab,
    setActiveTab,
    academicYears: academicYears.data?.items || [],
    isLoadingYears: academicYears.isLoading,
    selectedAcademicYearId,
    setSelectedAcademicYearId,
    classes: classes.data?.items || [],
    isLoadingClasses: classes.isLoading,
    selectedClassId,
    setSelectedClassId,
    sections: sections.data?.items || [],
    isLoadingSections: sections.isLoading,
    subjects: subjects.data?.items || [],
    isLoadingSubjects: subjects.isLoading,
    teachers: teachers.data?.items || [],
    teacherAssignments: teacherAssignments.data?.items || [],
    isLoadingAssignments: teacherAssignments.isLoading,

    showYearForm,
    setShowYearForm,
    yearName,
    setYearName,
    yearStart,
    setYearStart,
    yearEnd,
    setYearEnd,
    yearIsCurrent,
    setYearIsCurrent,
    submitYear,
    isCreatingYear: createAcademicYear.isLoading,

    showClassForm,
    setShowClassForm,
    className,
    setClassName,
    classLevel,
    setClassLevel,
    submitClass,
    isCreatingClass: createClass.isLoading,

    showSectionForm,
    setShowSectionForm,
    sectionName,
    setSectionName,
    sectionCapacity,
    setSectionCapacity,
    submitSection,
    isCreatingSection: createSection.isLoading,

    showSubjectForm,
    setShowSubjectForm,
    subjectName,
    setSubjectName,
    subjectCode,
    setSubjectCode,
    submitSubject,
    isCreatingSubject: createSubject.isLoading,

    showAssignForm,
    setShowAssignForm,
    assignTeacherId,
    setAssignTeacherId,
    assignClassId,
    setAssignClassId,
    assignSectionId,
    setAssignSectionId,
    assignSubjectId,
    setAssignSubjectId,
    assignRole,
    setAssignRole,
    assignSections: assignSections.data?.items || [],
    submitAssign,
    isAssigning: assignTeacher.isLoading,
  };
};

export default useClassesController;
