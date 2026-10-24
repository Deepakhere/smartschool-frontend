import { BookOpenIcon, CalendarDaysIcon, RectangleGroupIcon, Squares2X2Icon, UserGroupIcon } from "@heroicons/react/24/outline";

import SectionHeader, { HeaderActionsProvider } from "@/components/section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssignmentsTab from "./tabs/assignments-tab";
import ClassesTab from "./tabs/classes-tab";
import SectionsTab from "./tabs/sections-tab";
import SubjectsTab from "./tabs/subjects-tab";
import YearsTab from "./tabs/years-tab";
import useClassesController, { ClassesTabKey } from "./classes-controller";

const TABS: { key: ClassesTabKey; label: string; icon: typeof CalendarDaysIcon }[] = [
  { key: "years", label: "Academic years", icon: CalendarDaysIcon },
  { key: "classes", label: "Classes", icon: Squares2X2Icon },
  { key: "sections", label: "Sections", icon: RectangleGroupIcon },
  { key: "subjects", label: "Subjects", icon: BookOpenIcon },
  { key: "teachers", label: "Teacher assignments", icon: UserGroupIcon },
];

const AdminClasses = () => {
  const { organizationId, activeTab, setActiveTab, yearList, yearId, setYearId, classId, setClassId, showSections } =
    useClassesController();

  return (
    <HeaderActionsProvider>
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Academics"
          description="Set up your school year: classes, sections, subjects and who teaches what"
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ClassesTabKey)} className="mb-6">
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
