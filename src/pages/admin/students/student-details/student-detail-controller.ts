import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useDeleteStudent, useGetStudentById, useUpdateStudentDetail } from "../service";
import { useAddGuardian, useSetPrimaryGuardian, useRemoveGuardian } from "../service/guardian-service";
import { useGetEnrollmentHistory, useTransferStudent, useWithdrawStudent } from "../service/lifecycle-service";
import { useGetStudentAttendanceHistory } from "../service/attendance-history-service";
import { useGetResultsForStudent } from "../../reports/service/exams-service";
import { IStudentFormData } from "../../../../types";
import { useError } from "../../../../hooks";
import { editStudentSchema } from "../student-modal/create-update-student-modal/student-form.schema";

const useStudentDetailController = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { studentId, organizationId } = useParams();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [guardianIdPendingRemoval, setGuardianIdPendingRemoval] = useState<string | null>(null);
  const [isGuardianModalOpen, setIsGuardianModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<IStudentFormData>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {} as IStudentFormData,
  });

  const getStudentDetailById = useGetStudentById(organizationId || "", studentId || "");

  const updateStudent = useUpdateStudentDetail(organizationId || "");

  const deleteStudent = useDeleteStudent(organizationId || "");

  const addGuardian = useAddGuardian(organizationId || "", studentId || "");
  const setPrimaryGuardian = useSetPrimaryGuardian(organizationId || "", studentId || "");
  const removeGuardian = useRemoveGuardian(organizationId || "", studentId || "");

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const enrollmentHistory = useGetEnrollmentHistory(organizationId || "", studentId || "");
  const transferStudent = useTransferStudent(organizationId || "", studentId || "");
  const withdrawStudent = useWithdrawStudent(organizationId || "", studentId || "");
  const [attendanceFrom, setAttendanceFrom] = useState("");
  const [attendanceTo, setAttendanceTo] = useState("");
  const attendanceHistory = useGetStudentAttendanceHistory(
    organizationId || "",
    studentId || "",
    attendanceFrom || undefined,
    attendanceTo || undefined
  );
  const examResults = useGetResultsForStudent(organizationId || "", studentId || "");

  useError({
    mutation: deleteStudent,
    cb: () => {
      setIsDeleteModalOpen(false);
    },
  });

  useEffect(() => {
    if (getStudentDetailById.isSuccess && getStudentDetailById.data) {
      const item = getStudentDetailById.data.item;
      form.reset({
        ...item,
        academicYearId: item.currentEnrollment?.academicYearId || "",
        classId: item.currentEnrollment?.classId?.id || "",
        sectionId: item.currentEnrollment?.sectionId?.id || "",
        rollNumber: item.currentEnrollment?.rollNumber || "",
      } as IStudentFormData);

      // arrived here via the list page's "Edit" action — open the edit modal
      // once the full student data is in, then clear the flag so a refresh/back doesn't reopen it
      const state = location.state as { openEdit?: boolean } | null;
      if (state?.openEdit) {
        setIsEditModalOpen(true);
        navigate(location.pathname, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStudentDetailById.isSuccess, getStudentDetailById.data]);

  const onSubmit = form.handleSubmit((values) => {
    updateStudent.mutate(values);
  });

  const handleDeleteStudent = () => {
    deleteStudent.mutate(studentId || "");
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onBackClick = () => {
    navigate(`/${organizationId}/admin/students`);
  };

  useEffect(() => {
    if (updateStudent.isSuccess) {
      setIsEditModalOpen(false);
      getStudentDetailById.refetch();
      setCurrentStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStudent.isSuccess]);

  useEffect(() => {
    if (deleteStudent.isSuccess) {
      setIsDeleteModalOpen(false);
      navigate(`/${organizationId}/admin/students`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteStudent.isSuccess]);

  useEffect(() => {
    if (addGuardian.isSuccess) {
      toast.success("Guardian added successfully.");
      setIsGuardianModalOpen(false);
    }
    if (addGuardian.isError) {
      toast.error(addGuardian.error?.response?.Error?.message || "Failed to add guardian");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addGuardian.isSuccess, addGuardian.isError]);

  useEffect(() => {
    if (removeGuardian.isError) {
      toast.error(removeGuardian.error?.response?.Error?.message || "Failed to remove guardian");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeGuardian.isError]);

  const handleSetPrimaryGuardian = (guardianLinkId: string) => {
    setPrimaryGuardian.mutate(guardianLinkId);
  };

  const handleRemoveGuardian = (guardianLinkId: string) => {
    setGuardianIdPendingRemoval(guardianLinkId);
  };

  const cancelRemoveGuardian = () => setGuardianIdPendingRemoval(null);

  const confirmRemoveGuardian = () => {
    if (!guardianIdPendingRemoval) return;
    removeGuardian.mutate(guardianIdPendingRemoval, {
      onSuccess: () => setGuardianIdPendingRemoval(null),
    });
  };

  const confirmTransfer = () => {
    transferStudent.mutate(undefined, {
      onSuccess: () => {
        toast.success("Student marked as transferred.");
        setIsTransferModalOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.Error?.message || "Failed to transfer student");
      },
    });
  };

  const confirmWithdraw = () => {
    withdrawStudent.mutate(undefined, {
      onSuccess: () => {
        toast.success("Student marked as withdrawn.");
        setIsWithdrawModalOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.Error?.message || "Failed to withdraw student");
      },
    });
  };

  return {
    t,
    organizationId: organizationId || "",
    studentId: studentId || "",
    form,
    currentStep,
    updateStudent,
    isEditModalOpen,
    isDeleteModalOpen,
    isGuardianModalOpen,
    setIsGuardianModalOpen,
    studentDetails: getStudentDetailById?.data?.item,
    isLoadingStudentDetail: getStudentDetailById.isLoading,
    isErrorStudentDetail: getStudentDetailById.isError,
    onSubmit,
    nextStep,
    prevStep,
    onBackClick,
    setCurrentStep,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    isDeletingStudent: deleteStudent.isPending,
    handleDeleteStudent,
    addGuardian,
    handleSetPrimaryGuardian,
    handleRemoveGuardian,
    guardianIdPendingRemoval,
    isRemovingGuardian: removeGuardian.isPending,
    cancelRemoveGuardian,
    confirmRemoveGuardian,
    enrollmentHistory: enrollmentHistory.data?.items || [],
    isLoadingEnrollmentHistory: enrollmentHistory.isLoading,
    isTransferModalOpen,
    setIsTransferModalOpen,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    confirmTransfer,
    confirmWithdraw,
    isTransferring: transferStudent.isPending,
    isWithdrawing: withdrawStudent.isPending,
    attendanceSummary: attendanceHistory.data?.summary,
    attendanceRecords: attendanceHistory.data?.items || [],
    isLoadingAttendance: attendanceHistory.isLoading,
    attendanceFrom,
    setAttendanceFrom,
    attendanceTo,
    setAttendanceTo,
    examResults: examResults.data?.items || [],
    isLoadingExamResults: examResults.isLoading,
  };
};

export default useStudentDetailController;
