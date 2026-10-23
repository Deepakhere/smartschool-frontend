import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";

import ErrorState from "@/components/error-state";
import EmptyState from "@/components/empty-state";
import SectionHeader from "@/components/section-header";
import Spinner from "@/components/spinner";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types";
import {
  useGetAcademicYears,
  useGetClasses,
  useGetTeacherAssignments,
  useGetYearSections,
} from "../classes/service/academics-service";
import CreateEventDialog from "./components/create-event-dialog";
import EventSlotsPanel from "./components/event-slots-panel";
import { useGetPTMEvents } from "./service/ptm-service";

const AdminPTM = () => {
  const { organizationId = "" } = useParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState("");

  const years = useGetAcademicYears(organizationId);
  const currentYearId = years.data?.items.find((year) => year.isCurrent)?.id;
  const classes = useGetClasses(organizationId, currentYearId, "active");
  const sections = useGetYearSections(organizationId, currentYearId);
  const assignments = useGetTeacherAssignments(organizationId, currentYearId);
  const events = useGetPTMEvents(organizationId);

  const sectionOptions: SelectOption[] = (sections.data?.items ?? []).map((section) => ({
    id: section.id,
    name: `${classes.data?.items.find((klass) => klass.id === section.classId)?.name ?? ""} - ${section.name}`,
  }));

  const items = events.data?.items ?? [];

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        title="Parent-Teacher Meetings"
        description="Schedule PTM events, open teacher availability, and track parent bookings"
        action={{ label: "Schedule PTM", icon: PlusIcon, onClick: () => setIsCreateOpen(true) }}
      />

      {events.isError ? (
        <ErrorState error={events.error} onRetry={() => events.refetch()} />
      ) : (
        <div className="rounded-lg bg-white shadow">
          {events.isLoading ? (
            <Spinner />
          ) : items.length === 0 ? (
            <EmptyState title="No PTM events yet" description="Use Schedule PTM to create the first parent-teacher meeting." />
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((event) => {
                const isOpen = expandedEventId === event.id;
                return (
                  <div key={event.id} className="p-4">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpandedEventId(isOpen ? "" : event.id)}
                      className="flex w-full items-center justify-between rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm capitalize text-gray-500">
                          {new Date(event.date).toLocaleDateString()} · {event.mode} · {event.slotDurationMins} min slots
                        </p>
                      </div>
                      <span className="flex items-center gap-1 text-sm text-primary-600">
                        {isOpen ? "Hide" : "Manage slots"}
                        <ChevronDownIcon className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                      </span>
                    </button>
                    {isOpen && (
                      <EventSlotsPanel
                        organizationId={organizationId}
                        event={event}
                        assignments={assignments.data?.items ?? []}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <CreateEventDialog
        organizationId={organizationId}
        academicYearId={currentYearId}
        sectionOptions={sectionOptions}
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
};

export default AdminPTM;
