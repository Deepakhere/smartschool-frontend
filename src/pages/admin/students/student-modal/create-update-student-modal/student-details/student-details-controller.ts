import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { IStudentFormData, SelectOption } from "@/types";
import { useGetAcademicYears, useGetClasses, useGetSections } from "@/pages/admin/classes/service/academics-service";

type PickerField = { value: string; onChange: (value: string) => void };

const useStudentDetailsController = (organizationId: string, form: UseFormReturn<IStudentFormData>) => {
  const academicYearId = form.watch("academicYearId");
  const classId = form.watch("classId");
  const academicYears = useGetAcademicYears(organizationId);
  const classes = useGetClasses(organizationId, academicYearId, "active");
  const sections = useGetSections(organizationId, classId, "active");
  const currentYearId = academicYears.data?.items.find((y) => y.isCurrent)?.id;

  // a new student starts in the current year
  useEffect(() => {
    if (currentYearId && !form.getValues("academicYearId")) form.setValue("academicYearId", currentYearId);
  }, [currentYearId, form]);

  // a class and section from another year cannot stay picked
  const selectYear = (id: string, field: PickerField) => {
    if (id !== field.value) {
      form.setValue("classId", "");
      form.setValue("sectionId", "");
    }
    field.onChange(id);
  };

  const selectClass = (id: string, field: PickerField) => {
    if (id !== field.value) form.setValue("sectionId", "");
    field.onChange(id);
  };

  return {
    academicYearId,
    classId,
    yearOptions: (academicYears.data?.items || []).map((y): SelectOption => ({ id: y.id, name: y.name })),
    classOptions: (classes.data?.items || []).map((k): SelectOption => ({ id: k.id, name: k.name })),
    sectionOptions: (sections.data?.items || []).map((s): SelectOption => ({ id: s.id, name: s.name })),
    selectYear,
    selectClass,
  };
};

export default useStudentDetailsController;
