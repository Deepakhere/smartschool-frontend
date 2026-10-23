import DataTable from "@/components/data-table";
import ErrorState from "@/components/error-state";
import useMarksSheetCardController from "./marks-sheet-card-controller";
import { marksSheetColumns } from "./marks-sheet-columns";

interface MarksSheetCardProps {
  organizationId: string;
  examSubjectId: string;
  sectionId: string;
  // results published for the exam this subject belongs to: marks lock permanently
  examPublished: boolean;
  // only admins may verify marks already saved; a teacher saves but a second pair of eyes signs off
  canVerify?: boolean;
}

// the shared marks grid behind both the admin and teacher marks-entry screens: one student per row,
// theory/practical/absent, saved as a batch. Shown once an exam, class, section and subject are all chosen.
const MarksSheetCard = ({ organizationId, examSubjectId, sectionId, examPublished, canVerify = false }: MarksSheetCardProps) => {
  const c = useMarksSheetCardController(organizationId, examSubjectId, sectionId);
  const columns = marksSheetColumns({
    form: c.form,
    draftRows: c.draftRows,
    examSubject: c.examSubject,
    marksByStudent: c.marksByStudent,
    examPublished,
  });

  return (
    <div>
      <h3 className="mb-3 text-lg font-medium text-gray-900">Marks Sheet</h3>

      {examPublished && (
        <p className="mb-3 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
          Results for this exam are published, so these marks can no longer be changed.
        </p>
      )}
      {!examPublished && c.hasUnsavedMarks && <p className="mb-3 text-sm text-amber-700">You have unsaved changes.</p>}

      {c.error ? (
        <ErrorState error={c.error} onRetry={c.retry} />
      ) : (
        <DataTable
          columns={columns}
          data={c.rows}
          getRowId={(row) => row.id}
          isLoading={c.isLoading}
          actions={[
            { label: "Export CSV", onClick: c.onExport },
            { label: "Verify all", onClick: c.onVerify, loading: c.isVerifying, hidden: examPublished || !canVerify },
            { label: "Save marks", onClick: c.onSave, loading: c.isSaving, variant: "primary", hidden: examPublished },
          ]}
          empty={{ title: "No students in this section", description: "Marks can be entered once students are enrolled here." }}
        />
      )}
    </div>
  );
};

export default MarksSheetCard;
