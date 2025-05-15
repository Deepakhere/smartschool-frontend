import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetStudentById, useUpdateStudentDetail } from "../service";
import { IStudentFormData } from "../../../../types";

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

  const updateStudent = useUpdateStudentDetail();

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

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   updateStudent.mutate(formData, {
  //     onSuccess: () => {
  //       setIsEditModalOpen(false);
  //       refetch();
  //     },
  //   });
  // };

  const handleDeleteStudent = () => {
    // Implement delete functionality
    console.log("Deleting student", studentId);
    setIsDeleteModalOpen(false);
    navigate(`/${organizationId}/admin/students`);
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
    // handleSubmit,
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
