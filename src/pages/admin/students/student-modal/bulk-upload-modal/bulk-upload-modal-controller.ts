import { useState } from "react";
import toast from "react-hot-toast";

import useBulkImportStudents, { IBulkImportResult } from "../../service/bulk-import-students";
import { useGetAcademicYears, useGetClasses, useGetSections } from "../../../classes/service/academics-service";

const useBulkUploadModalController = (organizationId: string, onImported: () => void) => {
  const [academicYearId, setAcademicYearId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<IBulkImportResult | null>(null);

  const academicYears = useGetAcademicYears(organizationId);
  const classes = useGetClasses(organizationId, academicYearId);
  const sections = useGetSections(organizationId, classId);
  const bulkImport = useBulkImportStudents(organizationId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const onAcademicYearChange = (id: string) => {
    setAcademicYearId(id);
    setClassId("");
    setSectionId("");
  };

  const onClassChange = (id: string) => {
    setClassId(id);
    setSectionId("");
  };

  const reset = () => {
    setAcademicYearId("");
    setClassId("");
    setSectionId("");
    setFile(null);
    setResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicYearId || !classId || !sectionId || !file) {
      toast.error("Please select academic year, class, section and a CSV file");
      return;
    }
    bulkImport.mutate(
      { academicYearId, classId, sectionId, file },
      {
        onSuccess: (data) => {
          setResult(data);
          if (data.createdCount > 0) onImported();
        },
        onError: () => {
          toast.error("Failed to import students");
        },
      }
    );
  };

  return {
    academicYearId,
    setAcademicYearId: onAcademicYearChange,
    classId,
    setClassId: onClassChange,
    sectionId,
    setSectionId,
    file,
    handleFileChange,
    academicYears: academicYears.data?.items || [],
    classes: classes.data?.items || [],
    sections: sections.data?.items || [],
    result,
    reset,
    handleSubmit,
    isSubmitting: bulkImport.isLoading,
  };
};

export default useBulkUploadModalController;
