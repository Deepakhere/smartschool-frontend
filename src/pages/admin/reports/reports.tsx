import { AdjustmentsHorizontalIcon, ClipboardDocumentListIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import SectionHeader, { HeaderActionsProvider } from "@/components/section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamsTab from "./tabs/exams-tab";
import GradingSchemesTab from "./tabs/grading-schemes-tab";
import MarksEntryTab from "./tabs/marks-entry-tab";
import useReportsController, { ReportsTabKey } from "./reports-controller";

const TABS: { key: ReportsTabKey; label: string; icon: typeof ClipboardDocumentListIcon }[] = [
  { key: "exams", label: "Exams", icon: ClipboardDocumentListIcon },
  { key: "marks", label: "Marks Entry", icon: PencilSquareIcon },
  { key: "schemes", label: "Grading Schemes", icon: AdjustmentsHorizontalIcon },
];

const AdminReports = () => {
  const { organizationId, activeTab, setActiveTab, currentYearId, classOptions, subjectOptions } = useReportsController();

  return (
    <HeaderActionsProvider>
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Exams & Results" description="Set up grading, define exams, enter marks and publish results" />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ReportsTabKey)} className="mb-6">
          <TabsList>
            {TABS.map(({ key, label, icon: Icon }) => (
              <TabsTrigger key={key} value={key}>
                <Icon />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {activeTab === "schemes" && <GradingSchemesTab organizationId={organizationId} />}
        {activeTab === "exams" && (
          <ExamsTab
            organizationId={organizationId}
            academicYearId={currentYearId}
            classOptions={classOptions}
            subjectOptions={subjectOptions}
          />
        )}
        {activeTab === "marks" && <MarksEntryTab organizationId={organizationId} />}
      </div>
    </HeaderActionsProvider>
  );
};

export default AdminReports;
