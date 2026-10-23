import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetAcademicYears, useGetClasses, useGetSubjects } from "../classes/service/academics-service";

export type ReportsTabKey = "exams" | "marks" | "schemes";

const useReportsController = () => {
  const { organizationId = "" } = useParams();
  const [activeTab, setActiveTab] = useState<ReportsTabKey>("exams");

  const years = useGetAcademicYears(organizationId);
  const currentYearId = years.data?.items.find((year) => year.isCurrent)?.id;
  const classes = useGetClasses(organizationId, currentYearId);
  const subjects = useGetSubjects(organizationId, currentYearId);

  return {
    organizationId,
    activeTab,
    setActiveTab,
    currentYearId,
    classOptions: (classes.data?.items ?? []).map((klass) => ({ id: klass.id, name: klass.name })),
    subjectOptions: (subjects.data?.items ?? []).map((subject) => ({ id: subject.id, name: subject.name })),
  };
};

export default useReportsController;
