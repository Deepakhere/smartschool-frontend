import { AdjustmentsHorizontalIcon, ClipboardDocumentListIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import PageTabs, { PageTab } from "@/components/page-tabs";
import SectionHeader, { HeaderActionsProvider } from "@/components/section-header";
import ExamsTab from "./tabs/exams-tab";
import GradingSchemesTab from "./tabs/grading-schemes-tab";
import MarksEntryTab from "./tabs/marks-entry-tab";
import useReportsController, { ReportsTabKey } from "./reports-controller";

const AdminReports = () => {
  const { organizationId, activeTab, setActiveTab, currentYearId, classOptions, subjectOptions } =
    useReportsController();

  const TABS: PageTab<ReportsTabKey>[] = [
    {
      key: "exams",
      label: "Exams",
      icon: ClipboardDocumentListIcon,
      render: () => (
        <ExamsTab
          organizationId={organizationId}
          academicYearId={currentYearId}
          classOptions={classOptions}
          subjectOptions={subjectOptions}
        />
      ),
    },
    {
      key: "marks",
      label: "Marks Entry",
      icon: PencilSquareIcon,
      render: () => <MarksEntryTab organizationId={organizationId} />,
    },
    {
      key: "schemes",
      label: "Grading Schemes",
      icon: AdjustmentsHorizontalIcon,
      render: () => <GradingSchemesTab organizationId={organizationId} />,
    },
  ];

  return (
    <HeaderActionsProvider>
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Exams & Results"
          description="Set up grading, define exams, enter marks and publish results"
        />
        <PageTabs tabs={TABS} value={activeTab} onChange={setActiveTab} label="Exams sections" />
      </div>
    </HeaderActionsProvider>
  );
};

export default AdminReports;
