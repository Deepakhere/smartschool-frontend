import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createStudent } from "../../../services/students/create-student";
import { getStudents } from "../../../services/students/get-students";

interface IStudent {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

interface IStudentFormData {
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

export const useStudentsController = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<IStudentFormData>({
    name: "",
    classId: "",
    rollNumber: "",
    parentId: "",
    dateOfBirth: "",
  });

  const { data: students, isLoading, error } = useQuery<IStudent[]>({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const { mutate } = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      setFormData({
        name: "",
        classId: "",
        rollNumber: "",
        parentId: "",
        dateOfBirth: "",
      });
      setIsAddModalOpen(false);
      // TODO: Add success notification
    },
    onError: (error) => {
      // TODO: Add error notification
      console.error("Error creating student:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return {
    students,
    isLoading,
    error,
    formData,
    handleChange,
    handleSubmit,
    isAddModalOpen,
    setIsAddModalOpen,
  };
};
