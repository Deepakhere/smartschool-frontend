import { useState } from "react";
import { useParams } from "react-router-dom";
import { AdjustmentsHorizontalIcon, ClipboardDocumentListIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import SectionHeader, { HeaderActionsProvider } from "@/components/section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAcademicYears, useGetClasses, useGetSubjects } from "../classes/service/academics-service";
import ExamsTab from "./tabs/exams-tab";
import GradingSchemesTab from "./tabs/grading-schemes-tab";
import MarksEntryTab from "./tabs/marks-entry-tab";

const TABS = [
  { key: "exams", label: "Exams", icon: ClipboardDocumentListIcon },
  { key: "marks", label: "Marks Entry", icon: PencilSquareIcon },
  { key: "schemes", label: "Grading Schemes", icon: AdjustmentsHorizontalIcon },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const AdminReports = () => {
  const { organizationId = "" } = useParams();
  const [activeTab, setActiveTab] = useState<TabKey>("exams");

  const years = useGetAcademicYears(organizationId);
  const currentYearId = years.data?.items.find((year) => year.isCurrent)?.id;
  const classes = useGetClasses(organizationId, currentYearId);
  const subjects = useGetSubjects(organizationId, currentYearId);

  const classOptions = (classes.data?.items ?? []).map((klass) => ({ id: klass.id, name: klass.name }));
  const subjectOptions = (subjects.data?.items ?? []).map((subject) => ({ id: subject.id, name: subject.name }));

  return (
    <HeaderActionsProvider>
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Exams & Results" description="Set up grading, define exams, enter marks and publish results" />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)} className="mb-6">
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
