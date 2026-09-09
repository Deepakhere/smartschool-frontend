import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useGetTeacherDirectory, useUpsertStaffProfile } from "./service/teacher-directory-service";
import { ITeacherDirectoryEntry } from "../../../types";
import { staffProfileSchema, defaultStaffProfileValues } from "./teachers.schema";

const useTeachersController = () => {
  const { organizationId = "" } = useParams();

  const teachers = useGetTeacherDirectory(organizationId);
  const upsertStaffProfile = useUpsertStaffProfile(organizationId);

  const [editingTeacher, setEditingTeacher] = useState<ITeacherDirectoryEntry | null>(null);

  const form = useForm({ resolver: zodResolver(staffProfileSchema), defaultValues: defaultStaffProfileValues });

  const openEdit = (teacher: ITeacherDirectoryEntry) => {
    setEditingTeacher(teacher);
    form.reset({
      employeeCode: teacher.staffProfile?.employeeCode || "",
      designation: teacher.staffProfile?.designation || "",
      department: teacher.staffProfile?.department || "",
      qualification: teacher.staffProfile?.qualification || "",
      dateOfJoining: teacher.staffProfile?.dateOfJoining ? teacher.staffProfile.dateOfJoining.slice(0, 10) : "",
    });
  };

  const closeEdit = () => setEditingTeacher(null);

  const submitProfile = form.handleSubmit((values) => {
    if (!editingTeacher) return;
    upsertStaffProfile.mutate({ userId: editingTeacher.userId, ...values });
  });

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
    form,
    submitProfile,
    isSaving: upsertStaffProfile.isPending,
  };
};

export default useTeachersController;
