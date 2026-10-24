import { ChevronDownIcon } from "@heroicons/react/24/outline";

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ErrorState from "@/components/error-state";
import EmptyState from "@/components/empty-state";
import Spinner from "@/components/spinner";
import { Badge, BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types";
import CreateExamDialog from "../components/create-exam-dialog";
import ExamSubjectsPanel from "../components/exam-subjects-panel";
import useExamsTabController from "./exams-tab-controller";

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
  const c = useExamsTabController(organizationId);

  return (
    <Card>
      {c.error ? (
        <ErrorState error={c.error} onRetry={c.retry} />
      ) : c.isLoading ? (
        <Spinner />
      ) : c.items.length === 0 ? (
        <EmptyState title="No exams yet" description="Use Create exam to schedule the first one." />
      ) : (
        <div className="divide-y divide-gray-100">
          {c.items.map((exam) => {
            const isOpen = c.expandedExamId === exam.id;
            return (
              <div key={exam.id} className="py-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => c.toggleExpanded(exam.id)}
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
                      <Button variant="link" onClick={() => c.askPublish(exam.id)}>
                        Publish
                      </Button>
                    )}
                    <Button variant="link" onClick={() => c.toggleExpanded(exam.id)} className="gap-1">
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
        gradingSchemes={c.gradingSchemes}
        open={c.isCreateOpen}
        onClose={c.closeCreate}
      />

      <DeleteConfirmationDialog
        open={!!c.examToPublish}
        onClose={c.cancelPublish}
        onConfirm={c.confirmPublish}
        isLoading={c.isPublishing}
        tone="neutral"
        title="Publish this exam?"
        description="Results become visible to parents and marks lock permanently. This cannot be undone."
        confirmLabel="Publish"
      />
    </Card>
  );
};

export default ExamsTab;
