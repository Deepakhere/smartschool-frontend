import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { useGetAcademicYears, useGetClasses, useGetSections, useGetMyTeacherAssignments } from "./academics-service";

// The year, class and section pickers used wherever staff work on one section (attendance, homework, PTM).
// Admins choose from the whole school; teachers only from the classes and sections they teach. The current year is
// picked to start with, and choosing a year or class clears the choices below it.
export const useSectionPicker = (organizationId: string, { includeInactive = false } = {}) => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  const [academicYearId, setYear] = useState("");
  const [classId, setClass] = useState("");
  const [sectionId, setSectionId] = useState("");

  const status = includeInactive ? undefined : "active";
  const years = useGetAcademicYears(organizationId);
  const classes = useGetClasses(organizationId, academicYearId, status);
  const sections = useGetSections(organizationId, classId, status);
  const mine = useGetMyTeacherAssignments(organizationId, isTeacher);

  const taught = useMemo(() => {
    const items = mine.data?.items ?? [];
    return {
      yearIds: new Set(items.map((a) => a.academicYearId?.id)),
      classIds: new Set(items.map((a) => a.classId?.id)),
      sectionIds: new Set(items.map((a) => a.sectionId?.id)),
    };
  }, [mine.data]);

  const yearOptions = (years.data?.items ?? []).filter((y) => !isTeacher || taught.yearIds.has(y.id));
  const classOptions = (classes.data?.items ?? []).filter((c) => !isTeacher || taught.classIds.has(c.id));
  const sectionOptions = (sections.data?.items ?? []).filter((s) => !isTeacher || taught.sectionIds.has(s.id));

  useEffect(() => {
    if (academicYearId || !yearOptions.length) return;
    setYear((yearOptions.find((y) => y.isCurrent) ?? yearOptions[0]).id);
  }, [academicYearId, yearOptions]);

  const setAcademicYearId = (id: string) => {
    setYear(id);
    setClass("");
    setSectionId("");
  };
  const setClassId = (id: string) => {
    setClass(id);
    setSectionId("");
  };

  return {
    academicYears: yearOptions,
    classes: classOptions,
    sections: sectionOptions,
    academicYearId,
    setAcademicYearId,
    classId,
    setClassId,
    sectionId,
    setSectionId,
    isTeacher,
    // a teacher with no classes yet sees an explanation instead of empty pickers
    hasNoClasses: isTeacher && mine.isSuccess && (mine.data?.items.length ?? 0) === 0,
  };
};
