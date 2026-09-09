import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  yearFormSchema,
  defaultYearFormValues,
  classFormSchema,
  defaultClassFormValues,
  sectionFormSchema,
  defaultSectionFormValues,
  subjectFormSchema,
  defaultSubjectFormValues,
  assignFormSchema,
  defaultAssignFormValues,
} from "./classes.schema";

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
  const yearForm = useForm({ resolver: zodResolver(yearFormSchema), defaultValues: defaultYearFormValues });
  const createAcademicYear = useCreateAcademicYear(organizationId);

  const submitYear = yearForm.handleSubmit((values) => {
    createAcademicYear.mutate({
      name: values.name,
      startDate: values.startDate,
      endDate: values.endDate,
      isCurrent: values.isCurrent,
    });
  });

  useEffect(() => {
    if (createAcademicYear.isSuccess) {
      toast.success("Academic year created");
      setShowYearForm(false);
      yearForm.reset(defaultYearFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAcademicYear.isSuccess]);

  // class form
  const [showClassForm, setShowClassForm] = useState(false);
  const classForm = useForm({ resolver: zodResolver(classFormSchema), defaultValues: defaultClassFormValues });
  const createClass = useCreateClass(organizationId);

  const submitClass = classForm.handleSubmit((values) => {
    if (!selectedAcademicYearId) {
      toast.error("Select an academic year first");
      return;
    }
    createClass.mutate({
      name: values.name,
      academicYearId: selectedAcademicYearId,
      numericLevel: values.numericLevel ? Number(values.numericLevel) : undefined,
    });
  });

  useEffect(() => {
    if (createClass.isSuccess) {
      toast.success("Class created");
      setShowClassForm(false);
      classForm.reset(defaultClassFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createClass.isSuccess]);

  // section form
  const [showSectionForm, setShowSectionForm] = useState(false);
  const sectionForm = useForm({ resolver: zodResolver(sectionFormSchema), defaultValues: defaultSectionFormValues });
  const createSection = useCreateSection(organizationId);

  const submitSection = sectionForm.handleSubmit((values) => {
    if (!selectedClassId || !selectedAcademicYearId) {
      toast.error("Select a class first");
      return;
    }
    createSection.mutate({
      name: values.name,
      classId: selectedClassId,
      academicYearId: selectedAcademicYearId,
      capacity: values.capacity ? Number(values.capacity) : undefined,
    });
  });

  useEffect(() => {
    if (createSection.isSuccess) {
      toast.success("Section created");
      setShowSectionForm(false);
      sectionForm.reset(defaultSectionFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSection.isSuccess]);

  // subject form
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const subjectForm = useForm({ resolver: zodResolver(subjectFormSchema), defaultValues: defaultSubjectFormValues });
  const createSubject = useCreateSubject(organizationId);

  const submitSubject = subjectForm.handleSubmit((values) => {
    if (!selectedAcademicYearId) {
      toast.error("Select an academic year first");
      return;
    }
    createSubject.mutate({ name: values.name, code: values.code, academicYearId: selectedAcademicYearId });
  });

  useEffect(() => {
    if (createSubject.isSuccess) {
      toast.success("Subject created");
      setShowSubjectForm(false);
      subjectForm.reset(defaultSubjectFormValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSubject.isSuccess]);

  // teacher assignment form
  const [showAssignForm, setShowAssignForm] = useState(false);
  const assignForm = useForm({ resolver: zodResolver(assignFormSchema), defaultValues: defaultAssignFormValues });
  const assignClassId = assignForm.watch("classId");
  const assignSections = useGetSections(organizationId, assignClassId);
  const assignTeacher = useAssignTeacher(organizationId);

  useEffect(() => {
    assignForm.setValue("sectionId", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignClassId]);

  const submitAssign = assignForm.handleSubmit((values) => {
    if (!selectedAcademicYearId) {
      toast.error("Select an academic year first");
      return;
    }
    assignTeacher.mutate({
      teacherUserId: values.teacherId,
      academicYearId: selectedAcademicYearId,
      classId: values.classId,
      sectionId: values.sectionId,
      subjectId: values.role === "SUBJECT_TEACHER" ? values.subjectId : undefined,
      assignmentRole: values.role,
    });
  });

  useEffect(() => {
    if (assignTeacher.isSuccess) {
      toast.success("Teacher assigned");
      setShowAssignForm(false);
      assignForm.reset(defaultAssignFormValues);
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
    yearForm,
    submitYear,
    isCreatingYear: createAcademicYear.isPending,

    showClassForm,
    setShowClassForm,
    classForm,
    submitClass,
    isCreatingClass: createClass.isPending,

    showSectionForm,
    setShowSectionForm,
    sectionForm,
    submitSection,
    isCreatingSection: createSection.isPending,

    showSubjectForm,
    setShowSubjectForm,
    subjectForm,
    submitSubject,
    isCreatingSubject: createSubject.isPending,

    showAssignForm,
    setShowAssignForm,
    assignForm,
    assignSections: assignSections.data?.items || [],
    submitAssign,
    isAssigning: assignTeacher.isPending,
  };
};

export default useClassesController;
