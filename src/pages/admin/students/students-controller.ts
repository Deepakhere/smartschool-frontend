import { useState } from "react";
import { useAddStudent, useGetStudentDetails } from "./service";

// interface IStudent {
//   id: string;
//   name: string;
//   classId: string;
//   rollNumber: string;
//   parentId: string;
//   dateOfBirth: string;
// }

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

  const getStudentDetails = useGetStudentDetails();

  const addStudent = useAddStudent();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    addStudent.mutate({
      ...formData,
    });
  };

  // useEffect(() => {
  //   if (getStudentDetails.isSuccess && getStudentDetails.data) {

  //   }
  // }, []);

  return {
    formData,
    isAddModalOpen,
    studentDetail: getStudentDetails?.data?.items,
    isLoadingGetStudentDetails: getStudentDetails.isLoading,
    handleChange,
    handleSubmit,
    setIsAddModalOpen,
  };
};
