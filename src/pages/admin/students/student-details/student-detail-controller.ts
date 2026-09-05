import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  useDeleteStudent,
  useGetStudentById,
  useUpdateStudentDetail,
} from "../service";
import { useAddGuardian, useSetPrimaryGuardian, useRemoveGuardian } from "../service/guardian-service";
import { IStudentFormData } from "../../../../types";
import { useError } from "../../../../hooks";

const useStudentDetailController = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { studentId, organizationId } = useParams();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGuardianModalOpen, setIsGuardianModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({} as IStudentFormData);

  const getStudentDetailById = useGetStudentById(
    organizationId || "",
    studentId || ""
  );

  const updateStudent = useUpdateStudentDetail(organizationId || "");

  const deleteStudent = useDeleteStudent(organizationId || "");

  const addGuardian = useAddGuardian(organizationId || "", studentId || "");
  const setPrimaryGuardian = useSetPrimaryGuardian(organizationId || "", studentId || "");
  const removeGuardian = useRemoveGuardian(organizationId || "", studentId || "");

  useError({
    mutation: deleteStudent,
    cb: () => {
      setIsDeleteModalOpen(false);
    },
  });

  useEffect(() => {
    if (getStudentDetailById.isSuccess && getStudentDetailById.data) {
      const item = getStudentDetailById.data.item;
      setFormData({
        ...item,
        academicYearId: item.currentEnrollment?.academicYearId || "",
        classId: item.currentEnrollment?.classId?.id || "",
        sectionId: item.currentEnrollment?.sectionId?.id || "",
        rollNumber: item.currentEnrollment?.rollNumber || "",
      } as IStudentFormData);
    }
  }, [getStudentDetailById.isSuccess, getStudentDetailById.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "academicYearId" ? { classId: "", sectionId: "" } : {}),
      ...(name === "classId" ? { sectionId: "" } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent.mutate(formData);
  };

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
    if (window.confirm("Remove this guardian from the student?")) {
      removeGuardian.mutate(guardianLinkId);
    }
  };

  return {
    t,
    organizationId: organizationId || "",
    studentId: studentId || "",
    formData,
    currentStep,
    updateStudent,
    isEditModalOpen,
    isDeleteModalOpen,
    isGuardianModalOpen,
    setIsGuardianModalOpen,
    studentDetails: getStudentDetailById?.data?.item,
    isLoadingStudentDetail: getStudentDetailById.isLoading,
    isErrorStudentDetail: getStudentDetailById.isError,
    setFormData,
    handleChange,
    handleSubmit,
    nextStep,
    prevStep,
    onBackClick,
    setCurrentStep,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    handleDeleteStudent,
    addGuardian,
    handleSetPrimaryGuardian,
    handleRemoveGuardian,
  };
};

export default useStudentDetailController;
