import { useState } from "react";
import { useParams } from "react-router-dom";

import type { MultiOption } from "@/shared/ui/multi-select";
import { useGetAcademicYears, useGetClasses, useGetTeacherAssignments, useGetYearSections } from "@/entities/academics";
import { useGetPTMEvents } from "@/entities/ptm";

const useAdminPTMController = () => {
  const { organizationId = "" } = useParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState("");

  const years = useGetAcademicYears(organizationId);
  const currentYearId = years.data?.items.find((year) => year.isCurrent)?.id;
  const classes = useGetClasses(organizationId, currentYearId, "active");
  const sections = useGetYearSections(organizationId, currentYearId);
  const assignments = useGetTeacherAssignments(organizationId, currentYearId);
  const events = useGetPTMEvents(organizationId);

  const sectionOptions: MultiOption[] = (sections.data?.items ?? []).map((section) => {
    const className = classes.data?.items.find((klass) => klass.id === section.classId)?.name ?? "";
    return { id: section.id, name: `${className} - ${section.name}`, group: className, short: section.name };
  });

  return {
    organizationId,
    currentYearId,
    sectionOptions,
    assignments: assignments.data?.items ?? [],
    items: events.data?.items ?? [],
    isLoading: events.isLoading,
    error: events.isError ? events.error : null,
    retry: () => events.refetch(),
    expandedEventId,
    toggleEvent: (id: string) => setExpandedEventId((current) => (current === id ? "" : id)),
    isCreateOpen,
    openCreate: () => setIsCreateOpen(true),
    closeCreate: () => setIsCreateOpen(false),
  };
};

export default useAdminPTMController;
