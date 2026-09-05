import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useGetTeacherDirectory, useUpsertStaffProfile } from "./service/teacher-directory-service";
import { ITeacherDirectoryEntry } from "../../../types";

const useTeachersController = () => {
  const { organizationId = "" } = useParams();

  const teachers = useGetTeacherDirectory(organizationId);
  const upsertStaffProfile = useUpsertStaffProfile(organizationId);

  const [editingTeacher, setEditingTeacher] = useState<ITeacherDirectoryEntry | null>(null);
  const [employeeCode, setEmployeeCode] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [qualification, setQualification] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");

  const openEdit = (teacher: ITeacherDirectoryEntry) => {
    setEditingTeacher(teacher);
    setEmployeeCode(teacher.staffProfile?.employeeCode || "");
    setDesignation(teacher.staffProfile?.designation || "");
    setDepartment(teacher.staffProfile?.department || "");
    setQualification(teacher.staffProfile?.qualification || "");
    setDateOfJoining(teacher.staffProfile?.dateOfJoining ? teacher.staffProfile.dateOfJoining.slice(0, 10) : "");
  };

  const closeEdit = () => setEditingTeacher(null);

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    upsertStaffProfile.mutate({
      userId: editingTeacher.userId,
      employeeCode,
      designation,
      department,
      qualification,
      dateOfJoining,
    });
  };

  useEffect(() => {
    if (upsertStaffProfile.isSuccess) {
      toast.success("Staff profile saved.");
      setEditingTeacher(null);
    }
    if (upsertStaffProfile.isError) {
      toast.error(upsertStaffProfile.error?.response?.Error?.message || "Failed to save profile");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upsertStaffProfile.isSuccess, upsertStaffProfile.isError]);

  return {
    teachers: teachers.data?.items || [],
    isLoading: teachers.isLoading,
    editingTeacher,
    openEdit,
    closeEdit,
    employeeCode,
    setEmployeeCode,
    designation,
    setDesignation,
    department,
    setDepartment,
    qualification,
    setQualification,
    dateOfJoining,
    setDateOfJoining,
    submitProfile,
    isSaving: upsertStaffProfile.isLoading,
  };
};

export default useTeachersController;
