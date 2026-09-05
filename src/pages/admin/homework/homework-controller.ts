import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useGetAcademicYears, useGetClasses, useGetSections, useGetSubjects } from "../classes/service/academics-service";
import { useGetHomeworkList, useCreateHomework, useDeleteHomework } from "./service/homework-service";

const today = () => new Date().toISOString().slice(0, 10);

export const useHomeworkController = () => {
  const { organizationId = "" } = useParams();

  const [academicYearId, setAcademicYearIdRaw] = useState("");
  const [classId, setClassIdRaw] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedDate, setAssignedDate] = useState(today());
  const [dueDate, setDueDate] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const setAcademicYearId = (id: string) => {
    setAcademicYearIdRaw(id);
    setClassIdRaw("");
    setSectionId("");
  };

  const setClassId = (id: string) => {
    setClassIdRaw(id);
    setSectionId("");
  };

  const academicYears = useGetAcademicYears(organizationId);
  const classes = useGetClasses(organizationId, academicYearId);
  const sections = useGetSections(organizationId, classId);
  const subjects = useGetSubjects(organizationId, academicYearId);
  const homeworkList = useGetHomeworkList(organizationId, sectionId);

  const createHomework = useCreateHomework(organizationId, sectionId);
  const deleteHomework = useDeleteHomework(organizationId, sectionId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachment(e.target.files?.[0] || null);
  };

  const resetForm = () => {
    setSubjectId("");
    setTitle("");
    setDescription("");
    setAssignedDate(today());
    setDueDate("");
    setAttachment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicYearId || !classId || !sectionId || !subjectId || !title || !description || !dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("academicYearId", academicYearId);
    formData.append("classId", classId);
    formData.append("sectionId", sectionId);
    formData.append("subjectId", subjectId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("assignedDate", assignedDate);
    formData.append("dueDate", dueDate);
    if (attachment) formData.append("attachment", attachment);

    createHomework.mutate(formData);
  };

  useEffect(() => {
    if (createHomework.isSuccess) {
      toast.success("Homework created.");
      setShowForm(false);
      resetForm();
    }
    if (createHomework.isError) {
      toast.error(createHomework.error?.response?.Error?.message || "Failed to create homework");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createHomework.isSuccess, createHomework.isError]);

  const handleDelete = (homeworkId: string) => {
    if (window.confirm("Delete this homework?")) {
      deleteHomework.mutate(homeworkId);
    }
  };

  return {
    academicYears: academicYears.data?.items || [],
    classes: classes.data?.items || [],
    sections: sections.data?.items || [],
    subjects: subjects.data?.items || [],
    homeworkList: homeworkList.data?.items || [],
    isLoadingHomework: homeworkList.isLoading,
    academicYearId,
    setAcademicYearId,
    classId,
    setClassId,
    sectionId,
    setSectionId,
    showForm,
    setShowForm,
    subjectId,
    setSubjectId,
    title,
    setTitle,
    description,
    setDescription,
    assignedDate,
    setAssignedDate,
    dueDate,
    setDueDate,
    handleFileChange,
    handleSubmit,
    handleDelete,
    isCreating: createHomework.isLoading,
  };
};
