import { useState, ChangeEvent, FormEvent } from "react";
import { adminApi } from "../../../services/api";
import { ICreateReportRequest } from "../../../types";

export const useReportsController = () => {
  const [formData, setFormData] = useState<ICreateReportRequest>({
    studentId: "",
    academicYear: "",
    term: "",
    subjects: [
      {
        name: "",
        grade: "",
        remarks: "",
      },
    ],
    overallRemarks: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (
    index: number,
    field: "name" | "grade" | "remarks",
    value: string
  ) => {
    setFormData((prev) => {
      const newSubjects = [...prev.subjects];
      newSubjects[index] = { ...newSubjects[index], [field]: value };
      return { ...prev, subjects: newSubjects };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.reports.create(formData);
      // Reset form
      setFormData({
        studentId: "",
        academicYear: "",
        term: "",
        subjects: [
          {
            name: "",
            grade: "",
            remarks: "",
          },
        ],
        overallRemarks: "",
      });
      // TODO: Add success message
    } catch {
      // TODO: Add error handling
    }
  };

  return {
    formData,
    handleChange,
    handleSubjectChange,
    handleSubmit,
  };
};
