import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useDeleteStudent,
  useGetStudentById,
  useUpdateStudentDetail,
} from "../service";
import { IStudentFormData } from "../../../../types";
import { useError } from "../../../../hooks";

const useStudentDetailController = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { studentId, organizationId } = useParams();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({} as IStudentFormData);

  const getStudentDetailById = useGetStudentById(
    organizationId || "",
    studentId || ""
  );

  const updateStudent = useUpdateStudentDetail(organizationId || "");

  const deleteStudent = useDeleteStudent(organizationId || "");

  useError({
    mutation: deleteStudent,
    cb: () => {
      setIsDeleteModalOpen(false);
    },
  });

  useEffect(() => {
    if (getStudentDetailById.isSuccess && getStudentDetailById.data) {
      setFormData({
        ...getStudentDetailById.data.item,
      });
    }
  }, [getStudentDetailById.isSuccess, getStudentDetailById.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  return {
    t,
    formData,
    currentStep,
    updateStudent,
    isEditModalOpen,
    isDeleteModalOpen,
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
  };
};

export default useStudentDetailController;
