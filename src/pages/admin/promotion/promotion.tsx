import SectionHeader from "@/components/section-header";
import Spinner from "@/components/spinner";
import NoRecordFound from "@/components/no-record-found";
import CustomSelectDropdown from "@/components/custom-select";
import { usePromotionController } from "./promotion-controller";
import { PromotionAction, SelectOption } from "@/types";
import { useTranslation } from "react-i18next";

const btnPrimary =
  "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50";
const inputClass =
  "block w-24 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm";

const resultBadgeClass: Record<string, string> = {
  pass: "bg-green-100 text-green-800",
  fail: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-600",
};

const ACTION_OPTIONS: { value: PromotionAction; label: string }[] = [
  { value: "promote", label: "Promote" },
  { value: "detain", label: "Detain" },
  { value: "transfer", label: "Transfer" },
  { value: "withdraw", label: "Withdraw" },
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <CustomSelectDropdown
              placeholder="Select"
              options={asOptions(c.academicYears)}
              value={findOption(c.academicYears, c.sourceAcademicYearId)}
              onChange={(o) => c.setSourceAcademicYear(String(o.id))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.sourceAcademicYearId}
              options={asOptions(c.sourceClasses)}
              value={findOption(c.sourceClasses, c.sourceClassId)}
              onChange={(o) => c.setSourceClass(String(o.id))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <CustomSelectDropdown
              placeholder="Select"
              options={asOptions(c.academicYears)}
              value={findOption(c.academicYears, c.targetAcademicYearId)}
              onChange={(o) => c.setTargetAcademicYear(String(o.id))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class (for promoted students)</label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.targetAcademicYearId}
              options={asOptions(c.targetClasses)}
              value={findOption(c.targetClasses, c.targetClassId)}
              onChange={(o) => c.setTargetClass(String(o.id))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section (for promoted students)</label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.targetClassId}
              options={asOptions(c.targetSections)}
              value={findOption(c.targetSections, c.targetSectionId)}
              onChange={(o) => c.setTargetSectionId(String(o.id))}
            />
          </div>
        </div>
      </div>

      {c.sourceSectionId && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Students</h2>
            <button className={btnPrimary} disabled={c.isProcessing} onClick={c.handleProcess}>
              {c.isProcessing ? "Processing..." : "Process Promotions"}
            </button>
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
                      <select
                        className={inputClass}
                        style={{ width: "8rem" }}
                        value={row?.action || "promote"}
                        onChange={(e) => c.setRowAction(candidate.student.id, e.target.value as PromotionAction)}
                      >
                        {ACTION_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {(row?.action === "promote" || row?.action === "detain") && (
                        <input
                          className={inputClass}
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
    </div>
  );
};

export default Promotion;
