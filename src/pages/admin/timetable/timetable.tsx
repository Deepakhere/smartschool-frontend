import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PlusIcon } from "@heroicons/react/24/outline";

import CustomSelectDropdown from "@/components/custom-select";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ErrorState from "@/components/error-state";
import SectionHeader from "@/components/section-header";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useError } from "@/hooks";
import { ITimetableSlot, SelectOption } from "@/types";
import { useGetSubjects, useGetTeacherAssignments } from "../classes/service/academics-service";
import { useSectionPicker } from "../classes/service/use-section-picker";
import PeriodDialog from "./components/period-dialog";
import WeekGrid from "./components/week-grid";
import { useDeleteTimetableSlot, useGetTimetable } from "./service/timetable-service";
import { DAY_NAMES, formatTime } from "./timetable.utils";
import EmptyState from "@/components/empty-state";

const Picker = ({ label, options, value, disabled, onChange }: { label: string; options: SelectOption[]; value: string; disabled?: boolean; onChange: (id: string) => void }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
    <CustomSelectDropdown
      placeholder="Select"
      disabled={disabled}
      options={options}
      value={options.find((option) => option.id === value) ?? null}
      onChange={(option) => onChange(String(option.id))}
    />
  </div>
);

// admins build each section's week; a teacher sees their own week across every class they teach
const Timetable = () => {
  const { organizationId = "" } = useParams();
  const picker = useSectionPicker(organizationId);
  const { isTeacher, academicYearId, classId, sectionId } = picker;
  const [isAdding, setIsAdding] = useState(false);
  const [toRemove, setToRemove] = useState<ITimetableSlot | null>(null);

  const timetable = useGetTimetable(organizationId, isTeacher ? "" : sectionId, isTeacher || !!sectionId);
  const assignments = useGetTeacherAssignments(organizationId, academicYearId, !isTeacher && !!academicYearId);
  const subjects = useGetSubjects(organizationId, isTeacher ? undefined : academicYearId, "active");
  const remove = useDeleteTimetableSlot(organizationId);
  useError({ mutation: remove });

  const slots = timetable.data?.items ?? [];
  const sectionAssignments = (assignments.data?.items ?? []).filter((a) => a.sectionId?.id === sectionId && a.status !== "inactive");
  const ready = isTeacher || !!sectionId;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionHeader
        title={isTeacher ? "My Timetable" : "Timetable"}
        description={isTeacher ? "Your periods for the week, across every class you teach" : "Set up each section's periods for the week"}
      />

      {!isTeacher && (
        <div className="flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow">
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
            <Picker
              label="Academic Year"
              options={picker.academicYears.map((y) => ({ id: y.id, name: y.name }))}
              value={academicYearId}
              onChange={picker.setAcademicYearId}
            />
            <Picker
              label="Class"
              options={picker.classes.map((k) => ({ id: k.id, name: k.name }))}
              value={classId}
              disabled={!academicYearId}
              onChange={picker.setClassId}
            />
            <Picker
              label="Section"
              options={picker.sections.map((s) => ({ id: s.id, name: s.name }))}
              value={sectionId}
              disabled={!classId}
              onChange={picker.setSectionId}
            />
          </div>
          <Button onClick={() => setIsAdding(true)} disabled={!sectionId}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add period
          </Button>
        </div>
      )}

      {!ready ? (
        <div className="rounded-lg bg-white shadow">
          <EmptyState
            title={picker.classes.length ? "Pick a class and section" : "No classes yet"}
            description={picker.classes.length ? "Choose a class and section above to see and build its week." : "Add an academic year, classes and sections on the Classes page first."}
          />
        </div>
      ) : timetable.isError ? (
        <ErrorState error={timetable.error} onRetry={() => timetable.refetch()} />
      ) : timetable.isLoading ? (
        <Spinner />
      ) : slots.length === 0 ? (
        <div className="rounded-lg bg-white shadow">
          {isTeacher ? (
            <EmptyState title="No periods yet" description="Your school admin sets up your week on the Timetable page." />
          ) : (
            <EmptyState title="No periods yet" description="Use Add period to build this section's week." />
          )}
        </div>
      ) : (
        <WeekGrid slots={slots} showSection={isTeacher} onDelete={isTeacher ? undefined : setToRemove} />
      )}

      {!isTeacher && sectionId && (
        <PeriodDialog
          organizationId={organizationId}
          academicYearId={academicYearId}
          classId={classId}
          sectionId={sectionId}
          assignments={sectionAssignments}
          subjects={subjects.data?.items ?? []}
          open={isAdding}
          onClose={() => setIsAdding(false)}
        />
      )}
      <DeleteConfirmationDialog
        open={!!toRemove}
        onClose={() => setToRemove(null)}
        title="Remove period?"
        description={
          toRemove
            ? `${toRemove.subjectId?.name ?? "This period"} on ${DAY_NAMES[toRemove.dayOfWeek]}, ${formatTime(toRemove.startTime)} to ${formatTime(toRemove.endTime)}.`
            : ""
        }
        confirmLabel="Remove"
        isLoading={remove.isPending}
        onConfirm={() =>
          toRemove &&
          remove.mutate(toRemove.id, {
            onSuccess: () => {
              toast.success("Period removed.");
              setToRemove(null);
            },
          })
        }
      />
    </div>
  );
};

export default Timetable;
