import SectionHeader from "@/components/section-header";
import Spinner from "@/components/spinner";
import NoRecordFound from "@/components/no-record-found";
import CustomSelectDropdown from "@/components/custom-select";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePromotionController } from "./promotion-controller";
import { PromotionAction, SelectOption } from "@/types";
import { useTranslation } from "react-i18next";

const resultBadgeClass: Record<string, string> = {
  pass: "bg-green-100 text-green-800",
  fail: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-600",
};

const ACTION_OPTIONS: SelectOption[] = [
  { id: "promote", name: "Promote" },
  { id: "detain", name: "Detain" },
  { id: "transfer", name: "Transfer" },
  { id: "withdraw", name: "Withdraw" },
];

const Promotion = () => {
  const { t } = useTranslation();
  const c = usePromotionController();

  const asOptions = (items: { id: string; name: string }[]): SelectOption[] =>
    items.map((i) => ({ id: i.id, name: i.name }));

  const findOption = (items: { id: string; name: string }[], id: string): SelectOption | null => {
    const found = items.find((i) => i.id === id);
    return found ? { id: found.id, name: found.name } : null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader
        title="Student Promotion"
        description="Promote, detain, transfer or withdraw students at the end of the academic year"
      />

      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Source (current enrollment)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Academic Year</Label>
            <CustomSelectDropdown
              placeholder="Select"
              options={asOptions(c.academicYears)}
              value={findOption(c.academicYears, c.sourceAcademicYearId)}
              onChange={(o) => c.setSourceAcademicYear(String(o.id))}
            />
          </div>
          <div>
            <Label>Class</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.sourceAcademicYearId}
              options={asOptions(c.sourceClasses)}
              value={findOption(c.sourceClasses, c.sourceClassId)}
              onChange={(o) => c.setSourceClass(String(o.id))}
            />
          </div>
          <div>
            <Label>Section</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.sourceClassId}
              options={asOptions(c.sourceSections)}
              value={findOption(c.sourceSections, c.sourceSectionId)}
              onChange={(o) => c.setSourceSectionId(String(o.id))}
            />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 pt-2">
          Target (for students being promoted or detained)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Academic Year</Label>
            <CustomSelectDropdown
              placeholder="Select"
              options={asOptions(c.academicYears)}
              value={findOption(c.academicYears, c.targetAcademicYearId)}
              onChange={(o) => c.setTargetAcademicYear(String(o.id))}
            />
          </div>
          <div>
            <Label>Class (for promoted students)</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.targetAcademicYearId}
              options={asOptions(c.targetClasses)}
              value={findOption(c.targetClasses, c.targetClassId)}
              onChange={(o) => c.setTargetClass(String(o.id))}
            />
          </div>
          <div>
            <Label>Section (for promoted students)</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.targetClassId}
              options={asOptions(c.targetSections)}
              value={findOption(c.targetSections, c.targetSectionId)}
              onChange={(o) => c.setTargetSectionId(String(o.id))}
            />
          </div>
          <div className="hidden sm:block" />
          <div>
            <Label>Class (for detained students)</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.targetAcademicYearId}
              options={asOptions(c.targetClasses)}
              value={findOption(c.targetClasses, c.detainClassId)}
              onChange={(o) => c.setDetainClass(String(o.id))}
            />
          </div>
          <div>
            <Label>Section (for detained students)</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.detainClassId}
              options={asOptions(c.detainSections)}
              value={findOption(c.detainSections, c.detainSectionId)}
              onChange={(o) => c.setDetainSectionId(String(o.id))}
            />
          </div>
        </div>
      </div>

      {c.lastRun.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Last run</h2>
          <ul className="divide-y divide-gray-100 text-sm">
            {c.lastRun.map((row) => (
              <li key={row.name} className="flex justify-between gap-4 py-1.5">
                <span className="text-gray-900">
                  {row.name} <span className="text-gray-500">({row.action})</span>
                </span>
                <span className={row.success ? "text-green-700" : "text-red-600"}>{row.success ? "Done" : row.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.sourceSectionId && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Students</h2>
            <Button disabled={c.isProcessing} onClick={c.handleProcess}>
              {c.isProcessing ? "Processing..." : "Process Promotions"}
            </Button>
          </div>

          {c.isLoadingCandidates ? (
            <Spinner />
          ) : c.candidates.length === 0 ? (
            <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
          ) : (
            <div className="divide-y divide-gray-100">
              {c.candidates.map((candidate) => {
                const row = c.rowsState[candidate.student.id];
                const outcome = c.resultsByStudent[candidate.student.id];
                return (
                  <div key={candidate.student.id} className="px-4 py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {candidate.student.name}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          ({candidate.student.admissionNumber})
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Current roll no. {candidate.rollNumber}
                        {candidate.result ? (
                          <>
                            {" · "}
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full capitalize ${resultBadgeClass[candidate.result.promotionStatus]}`}
                            >
                              {candidate.result.promotionStatus}
                            </span>{" "}
                            ({candidate.result.examName}
                            {candidate.result.percentage !== null ? `, ${candidate.result.percentage}%` : ""})
                          </>
                        ) : (
                          <span className="ml-1 inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            No result published
                          </span>
                        )}
                      </p>
                      {outcome && (
                        <p className={`text-xs mt-1 ${outcome.success ? "text-green-600" : "text-red-600"}`}>
                          {outcome.success ? "Processed successfully" : outcome.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <CustomSelectDropdown
                        className="w-32"
                        options={ACTION_OPTIONS}
                        value={ACTION_OPTIONS.find((o) => o.id === (row?.action || "promote")) || null}
                        onChange={(o) => c.setRowAction(candidate.student.id, o.id as PromotionAction)}
                      />
                      {(row?.action === "promote" || row?.action === "detain") && (
                        <Input
                          className="w-24 px-2 py-1.5"
                          placeholder="Roll No."
                          value={row?.rollNumber || ""}
                          onChange={(e) => c.setRowRollNumber(candidate.student.id, e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <DeleteConfirmationDialog
        open={c.confirmOpen}
        onClose={() => c.setConfirmOpen(false)}
        onConfirm={c.confirmProcess}
        isLoading={c.isProcessing}
        tone="neutral"
        title="Process these students?"
        description={
          <>
            {(["promote", "detain", "transfer", "withdraw"] as const)
              .filter((action) => c.counts[action])
              .map((action) => `${c.counts[action]} ${action}`)
              .join(", ")}
            . Students are moved into their new classes right away; this cannot be undone from here.
          </>
        }
        confirmLabel="Process"
      />
    </div>
  );
};

export default Promotion;
