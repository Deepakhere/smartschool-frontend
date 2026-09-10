import { BookOpenIcon } from "@heroicons/react/24/outline";

import Spinner from "@/components/spinner";
import NoRecordFound from "@/components/no-record-found";
import SectionHeader from "@/components/section-header";
import CustomSelectDropdown from "@/components/custom-select";
import { useHomeworkController } from "./homework-controller";
import { SelectOption } from "@/types";

const ParentHomework = () => {
  const { t, children, studentId, setStudentId, homeworkList, isLoading } = useHomeworkController();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader title="Homework" description="Assignments given to your child" />

      {children.length > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Child</label>
          <div className="w-64">
            <CustomSelectDropdown
              placeholder="Select child"
              options={children.map((child): SelectOption => ({ id: child.studentId.id, name: child.studentId.name }))}
              value={(() => {
                const child = children.find((child) => child.studentId.id === studentId);
                return child ? { id: child.studentId.id, name: child.studentId.name } : null;
              })()}
              onChange={(o) => setStudentId(String(o.id))}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {isLoading ? (
          <Spinner />
        ) : homeworkList.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <div className="space-y-4">
            {homeworkList.map((hw) => (
              <div key={hw.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-primary-500 shrink-0" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {hw.title}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      ({typeof hw.subjectId === "object" ? hw.subjectId.name : ""})
                    </span>
                  </h2>
                </div>
                <p className="text-gray-600 text-sm mt-1">Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
                <p className="mt-2 text-gray-700">{hw.description}</p>
                {hw.attachmentURL && (
                  <a
                    href={hw.attachmentURL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-primary-600 hover:underline"
                  >
                    View attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentHomework;
