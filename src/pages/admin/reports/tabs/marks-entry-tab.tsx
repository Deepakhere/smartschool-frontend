import CustomSelectDropdown from "@/components/custom-select";
import { Card, CardTitle } from "@/components/ui/card";
import MarksSheetCard from "../components/marks-sheet-card";
import EmptyState from "@/components/empty-state";
import useMarksEntryTabController from "./marks-entry-tab-controller";

const MarksEntryTab = ({ organizationId }: { organizationId: string }) => {
  const c = useMarksEntryTabController(organizationId);

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle className="mb-4 font-medium">Select exam, class, section &amp; subject</CardTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <CustomSelectDropdown
            placeholder="Select exam"
            options={c.examOptions}
            value={c.examOptions.find((o) => o.id === c.examId) ?? null}
            onChange={(o) => c.selectExam(String(o.id))}
          />
          <CustomSelectDropdown
            placeholder="Select class"
            disabled={!c.examId}
            options={c.classOptions}
            value={c.classOptions.find((o) => o.id === c.classId) ?? null}
            onChange={(o) => c.selectClass(String(o.id))}
          />
          <CustomSelectDropdown
            placeholder="Select section"
            disabled={!c.classId}
            options={c.sectionOptions}
            value={c.sectionOptions.find((o) => o.id === c.sectionId) ?? null}
            onChange={(o) => c.selectSection(String(o.id))}
          />
          <CustomSelectDropdown
            placeholder="Select subject"
            disabled={!c.classId}
            options={c.subjectOptions}
            value={c.subjectOptions.find((o) => o.id === c.examSubjectId) ?? null}
            onChange={(o) => c.selectSubject(String(o.id))}
          />
        </div>
      </Card>

      {!c.isSheetReady && (
        <Card>
          <EmptyState
            title={c.examOptions.length ? "Pick an exam, class, section and subject" : "No exams yet"}
            description={
              c.examOptions.length
                ? "The marks sheet for that paper opens here."
                : "Create an exam in the Exams tab, add its subjects, then enter marks here."
            }
          />
        </Card>
      )}

      {c.isSheetReady && (
        <MarksSheetCard
          organizationId={organizationId}
          examSubjectId={c.examSubjectId}
          sectionId={c.sectionId}
          examPublished={c.examPublished}
          canVerify
        />
      )}
    </div>
  );
};

export default MarksEntryTab;
