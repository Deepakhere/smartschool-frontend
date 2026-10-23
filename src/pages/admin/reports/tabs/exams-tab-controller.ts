import { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";

import { useHeaderActions } from "@/components/section-header";
import { useError } from "@/hooks";
import { useGetExams, useGetGradingSchemes, usePublishExam } from "../service/exams-service";

const useExamsTabController = (organizationId: string) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState("");
  const [examToPublish, setExamToPublish] = useState("");

  const exams = useGetExams(organizationId);
  const gradingSchemes = useGetGradingSchemes(organizationId);
  const publishExam = usePublishExam(organizationId);
  useError({ mutation: publishExam });

  useHeaderActions({ action: { label: "Create exam", icon: PlusIcon, onClick: () => setIsCreateOpen(true) } });

  // results become visible to parents and marks lock permanently, so this is confirmed first
  const confirmPublish = () => {
    if (!examToPublish) return;
    publishExam.mutate(examToPublish, {
      onSuccess: () => {
        toast.success("Results published.");
        setExamToPublish("");
      },
    });
  };

  return {
    items: exams.data?.items ?? [],
    isLoading: exams.isLoading,
    error: exams.isError ? exams.error : null,
    retry: () => exams.refetch(),
    gradingSchemes: gradingSchemes.data?.items ?? [],
    isCreateOpen,
    closeCreate: () => setIsCreateOpen(false),
    expandedExamId,
    toggleExpanded: (examId: string) => setExpandedExamId((current) => (current === examId ? "" : examId)),
    examToPublish,
    askPublish: setExamToPublish,
    cancelPublish: () => setExamToPublish(""),
    confirmPublish,
    isPublishing: publishExam.isPending,
  };
};

export default useExamsTabController;
