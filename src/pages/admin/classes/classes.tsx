import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BookOpenIcon, CalendarDaysIcon, RectangleGroupIcon, Squares2X2Icon, UserGroupIcon } from "@heroicons/react/24/outline";

import SectionHeader, { HeaderActionsProvider } from "@/components/section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAcademicYears, useGetClasses } from "./service/academics-service";
import AssignmentsTab from "./tabs/assignments-tab";
import ClassesTab from "./tabs/classes-tab";
import SectionsTab from "./tabs/sections-tab";
import SubjectsTab from "./tabs/subjects-tab";
import YearsTab from "./tabs/years-tab";

const TABS = [
  { key: "years", label: "Academic years", icon: CalendarDaysIcon },
  { key: "classes", label: "Classes", icon: Squares2X2Icon },
  { key: "sections", label: "Sections", icon: RectangleGroupIcon },
  { key: "subjects", label: "Subjects", icon: BookOpenIcon },
  { key: "teachers", label: "Teacher assignments", icon: UserGroupIcon },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const AdminClasses = () => {
  const { organizationId = "" } = useParams();

  const [activeTab, setActiveTab] = useState<TabKey>("years");
  const [yearId, setYearId] = useState("");
  const [classId, setClassId] = useState("");

  const years = useGetAcademicYears(organizationId);
  const yearList = useMemo(() => years.data?.items ?? [], [years.data]);
  // inactive classes too, so "View sections" works on them (same query the sections tab uses)
  const classes = useGetClasses(organizationId, yearId);

  // start on the current year (or the newest one) so every tab opens with something useful
  useEffect(() => {
    if (!yearId && yearList.length) setYearId((yearList.find((year) => year.isCurrent) ?? yearList[0]).id);
  }, [yearList, yearId]);

  // a class from another year cannot stay selected; fall back to the first active class of the chosen year
  useEffect(() => {
    const firstClass = classes.data?.items.find((klass) => klass.status === "active");
    if (classes.data && !classes.data.items.some((klass) => klass.id === classId)) setClassId(firstClass?.id ?? "");
  }, [classes.data, classId]);

  const showSections = (id: string) => {
    setClassId(id);
    setActiveTab("sections");
  };

  return (
    <HeaderActionsProvider>
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Academics"
          description="Set up your school year: classes, sections, subjects and who teaches what"
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)} className="mb-6">
          <TabsList aria-label="Academics sections">
            {TABS.map(({ key, label, icon: Icon }) => (
              <TabsTrigger key={key} value={key}>
                <Icon />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {activeTab === "years" && <YearsTab organizationId={organizationId} />}
        {activeTab === "classes" && (
          <ClassesTab
            organizationId={organizationId}
            years={yearList}
            yearId={yearId}
            onYearChange={setYearId}
            onViewSections={showSections}
          />
        )}
        {activeTab === "sections" && (
          <SectionsTab organizationId={organizationId} yearId={yearId} classId={classId} onClassChange={setClassId} />
        )}
        {activeTab === "subjects" && (
          <SubjectsTab organizationId={organizationId} years={yearList} yearId={yearId} onYearChange={setYearId} />
        )}
        {activeTab === "teachers" && <AssignmentsTab organizationId={organizationId} yearId={yearId} />}
      </div>
    </HeaderActionsProvider>
  );
};

export default AdminClasses;
