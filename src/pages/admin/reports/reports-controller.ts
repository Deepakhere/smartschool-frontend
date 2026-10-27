import { useParams } from "react-router-dom";

import { useTabParam } from "@/hooks";
import { useGetAcademicYears, useGetClasses, useGetSubjects } from "../classes/service/academics-service";

const REPORTS_TABS = ["exams", "marks", "schemes"] as const;
export type ReportsTabKey = (typeof REPORTS_TABS)[number];

const useReportsController = () => {
  const { organizationId = "" } = useParams();
  const [activeTab, setActiveTab] = useTabParam(REPORTS_TABS, "exams");

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
