import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createStudent } from "../../../services/students/create-student";

interface IStudentFormData {
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

export const useStudentsController = () => {
  const [formData, setFormData] = useState<IStudentFormData>({
    name: "",
    classId: "",
    rollNumber: "",
    parentId: "",
    dateOfBirth: "",
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
    formData,
    handleChange,
    handleSubmit,
  };
};
