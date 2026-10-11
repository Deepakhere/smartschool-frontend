import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ErrorState from "@/components/error-state";
import NoRecordFound from "@/components/no-record-found";
import Spinner from "@/components/spinner";
import { Badge, BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useError } from "@/hooks";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types";
import CreateExamDialog from "../components/create-exam-dialog";
import ExamSubjectsPanel from "../components/exam-subjects-panel";
import { useGetExams, useGetGradingSchemes, usePublishExam } from "../service/exams-service";

const STATUS_TONE: Record<string, BadgeTone> = {
  published: "green",
  verified: "gray",
  marks_entry: "yellow",
  scheduled: "yellow",
};

interface ExamsTabProps {
  organizationId: string;
  academicYearId?: string;
  classOptions: SelectOption[];
  subjectOptions: SelectOption[];
}

const ExamsTab = ({ organizationId, academicYearId, classOptions, subjectOptions }: ExamsTabProps) => {
  const { t } = useTranslation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState("");
  const [examToPublish, setExamToPublish] = useState("");

  const exams = useGetExams(organizationId);
  const gradingSchemes = useGetGradingSchemes(organizationId);
  const publishExam = usePublishExam(organizationId);
  useError({ mutation: publishExam });

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

  const items = exams.data?.items ?? [];

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <CardTitle className="font-medium">Exams</CardTitle>
        <Button onClick={() => setIsCreateOpen(true)}>+ Create Exam</Button>
      </div>

      {exams.isError ? (
        <ErrorState error={exams.error} onRetry={() => exams.refetch()} />
      ) : exams.isLoading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
      ) : (
        <div className="divide-y divide-gray-100">
          {items.map((exam) => {
            const isOpen = expandedExamId === exam.id;
            return (
              <div key={exam.id} className="py-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setExpandedExamId(isOpen ? "" : exam.id)}
                    className="rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <p className="font-medium text-gray-900">
                      {exam.name} <Badge tone={STATUS_TONE[exam.status] ?? "gray"} className="ml-1 capitalize">{exam.status.replace("_", " ")}</Badge>
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()} ·{" "}
                      {exam.classIds.map((klass) => klass.name).join(", ")}
                    </p>
                  </button>
                  <div className="flex items-center gap-3">
                    {exam.status !== "published" && (
                      <Button variant="link" onClick={() => setExamToPublish(exam.id)}>
                        Publish
                      </Button>
                    )}
                    <Button variant="link" onClick={() => setExpandedExamId(isOpen ? "" : exam.id)} className="gap-1">
                      {isOpen ? "Hide" : "Manage subjects"}
                      <ChevronDownIcon className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <ExamSubjectsPanel organizationId={organizationId} exam={exam} subjectOptions={subjectOptions} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <CreateExamDialog
        organizationId={organizationId}
        academicYearId={academicYearId}
        classOptions={classOptions}
        gradingSchemes={gradingSchemes.data?.items ?? []}
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <DeleteConfirmationDialog
        open={!!examToPublish}
        onClose={() => setExamToPublish("")}
        onConfirm={confirmPublish}
        isLoading={publishExam.isPending}
        tone="neutral"
        title="Publish this exam?"
        description="Results become visible to parents and marks lock permanently. This cannot be undone."
        confirmLabel="Publish"
      />
    </Card>
  );
};

export default ExamsTab;
