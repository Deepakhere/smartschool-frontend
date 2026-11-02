import DeleteConfirmationDialog from "@/shared/ui/delete-confirmation-dialog";
import EmptyState from "@/shared/ui/empty-state";
import ErrorState from "@/shared/ui/error-state";
import Spinner from "@/shared/ui/spinner";
import { Card } from "@/shared/ui/kit/card";
import StudentFeeCard from "../components/student-fee-card";
import StudentSearch from "../components/student-search";
import useStudentFeesController from "./student-fees-controller";

const StudentFeesTab = ({ organizationId }: { organizationId: string }) => {
  const c = useStudentFeesController(organizationId);

  return (
    <div className="space-y-6">
      <StudentSearch
        search={c.search}
        onSearchChange={c.setSearch}
        matches={c.matches}
        isSearching={c.isSearching}
        hasQuery={!!c.debouncedSearch}
        selected={c.selected}
        onPick={c.pick}
        onClear={c.clearPick}
      />

      {!c.studentId && (
        <Card>
          <EmptyState
            title="Pick a student"
            description="Search by name or admission number to see their fees and record payments."
          />
        </Card>
      )}

      {c.studentId &&
        (c.summaryError ? (
          <ErrorState
            error={c.summaryError}
            title="This student's fees could not be loaded."
            onRetry={c.retrySummary}
          />
        ) : c.isLoadingSummary ? (
          <Spinner />
        ) : c.summaries.length === 0 ? (
          <Card>
            <EmptyState
              title="No fees assigned yet"
              description="Assign a fee structure to this student's class from the Fee Structures tab."
            />
          </Card>
        ) : (
          c.summaries.map((summary) => (
            <StudentFeeCard
              key={summary.studentFeeId}
              organizationId={organizationId}
              summary={summary}
              onReverse={c.setPaymentToReverse}
            />
          ))
        ))}

      <DeleteConfirmationDialog
        open={!!c.paymentToReverse}
        onClose={() => c.setPaymentToReverse(null)}
        onConfirm={c.confirmReverse}
        isLoading={c.isReversing}
        title="Reverse this payment?"
        description="A reversal entry is added to the ledger and the amount becomes due again. This cannot be undone."
        confirmLabel="Reverse payment"
      />
    </div>
  );
};

export default StudentFeesTab;
