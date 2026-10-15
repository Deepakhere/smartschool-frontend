import { useState } from "react";
import toast from "react-hot-toast";

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ErrorState from "@/components/error-state";
import Spinner from "@/components/spinner";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebouncedValue, useError } from "@/hooks";
import { cn } from "@/lib/utils";
import useGetStudentDetails from "../../students/service/get-student-details/get-student-details";
import StudentFeeCard from "../components/student-fee-card";
import { useGetStudentFeeSummary, useReversePayment } from "../service/fees-service";
import EmptyState from "@/components/empty-state";

const StudentFeesTab = ({ organizationId }: { organizationId: string }) => {
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [paymentToReverse, setPaymentToReverse] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search.trim());
  const students = useGetStudentDetails(organizationId, "all", debouncedSearch, 10, 1);
  const feeSummary = useGetStudentFeeSummary(organizationId, studentId);
  const reversePayment = useReversePayment(organizationId);
  useError({ mutation: reversePayment });

  // reversing cannot be undone, so it is confirmed first
  const confirmReverse = () => {
    if (!paymentToReverse) return;
    reversePayment.mutate(paymentToReverse, {
      onSuccess: () => {
        toast.success("Payment reversed.");
        setPaymentToReverse(null);
      },
    });
  };

  const summaries = feeSummary.data?.items ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle className="mb-4 font-medium">Find a student</CardTitle>
        <Input
          aria-label="Search students"
          placeholder="Search by name or admission number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {(students.data?.items ?? []).map((student) => (
            <button
              key={student.id}
              type="button"
              aria-pressed={studentId === student.id}
              onClick={() => setStudentId(student.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                studentId === student.id
                  ? "border-primary-300 bg-primary-100 text-primary-800"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              {student.name}
            </button>
          ))}
        </div>
      </Card>

      {!studentId && !students.isLoading && (
        <Card>
          {(students.data?.items ?? []).length || debouncedSearch ? (
            <EmptyState
              title={(students.data?.items ?? []).length ? "Pick a student" : "No matching students"}
              description={(students.data?.items ?? []).length ? "Search above and choose a student to see their fees and record payments." : `No student matches "${debouncedSearch}".`}
            />
          ) : (
            <EmptyState title="No students yet" description="Add students first; their fees and payments are managed here." />
          )}
        </Card>
      )}

      {studentId &&
        (feeSummary.isError ? (
          <ErrorState error={feeSummary.error} title="This student's fees could not be loaded." onRetry={() => feeSummary.refetch()} />
        ) : feeSummary.isLoading ? (
          <Spinner />
        ) : summaries.length === 0 ? (
          <Card>
            <EmptyState title="No fees assigned yet" description="Assign a fee structure to this student's class from the Fee Structures tab." />
          </Card>
        ) : (
          summaries.map((summary) => (
            <StudentFeeCard
              key={summary.studentFeeId}
              organizationId={organizationId}
              summary={summary}
              onReverse={setPaymentToReverse}
            />
          ))
        ))}

      <DeleteConfirmationDialog
        open={!!paymentToReverse}
        onClose={() => setPaymentToReverse(null)}
        onConfirm={confirmReverse}
        isLoading={reversePayment.isPending}
        title="Reverse this payment?"
        description="A reversal entry is added to the ledger and the amount becomes due again. This cannot be undone."
        confirmLabel="Reverse payment"
      />
    </div>
  );
};

export default StudentFeesTab;
