import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@heroicons/react/24/outline";

import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ErrorState from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { useError, usePageHeader } from "@/hooks";
import { ICalendarEntry } from "@/types";
import { localDateString } from "@/utils";
import EntryDialog from "./components/entry-dialog";
import EventsSidebar, { EntryFilter } from "./components/events-sidebar";
import MonthGrid from "./components/month-grid";
import { toGridItems } from "./calendar.utils";
import { useDeleteCalendarEntry, useGetCalendarMonth } from "./service/calendar-service";

const AdminCalendar = () => {
  const { organizationId = "" } = useParams();
  const today = localDateString();
  const [cursor, setCursor] = useState(() => ({ year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) }));
  const [filter, setFilter] = useState<EntryFilter>("all");
  const [dialog, setDialog] = useState<{ entry: ICalendarEntry | null; date: string } | null>(null);
  const [toDelete, setToDelete] = useState<ICalendarEntry | null>(null);

  const month = useGetCalendarMonth(organizationId, cursor.year, cursor.month);
  const deleteEntry = useDeleteCalendarEntry(organizationId);
  useError({ mutation: deleteEntry });

  usePageHeader({
    actions: (
      <Button onClick={() => setDialog({ entry: null, date: today })}>
        <PlusIcon className="mr-1 h-4 w-4" />
        Add Event
      </Button>
    ),
  });

  const itemsByDate = useMemo(
    () => toGridItems(month.data?.entries ?? [], [...(month.data?.examDays ?? []), ...(month.data?.birthdays ?? [])]),
    [month.data]
  );

  const shift = (by: number) =>
    setCursor(({ year, month: current }) => {
      const next = new Date(year, current - 1 + by, 1);
      return { year: next.getFullYear(), month: next.getMonth() + 1 };
    });

  const label = new Date(cursor.year, cursor.month - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => shift(-1)} aria-label="Previous month">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => setCursor({ year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) })}>
            Today
          </Button>
          <Button variant="secondary" onClick={() => shift(1)} aria-label="Next month">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {month.isError ? (
        <ErrorState error={month.error} onRetry={() => month.refetch()} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <MonthGrid
            year={cursor.year}
            month={cursor.month}
            today={today}
            itemsByDate={itemsByDate}
            onPickDay={(date) => setDialog({ entry: null, date })}
            onPickEntry={(entry) => setDialog({ entry, date: entry.date })}
          />
          <EventsSidebar
            entries={month.data?.entries ?? []}
            filter={filter}
            onFilter={setFilter}
            onEdit={(entry) => setDialog({ entry, date: entry.date })}
            onDelete={setToDelete}
          />
        </div>
      )}

      <EntryDialog
        organizationId={organizationId}
        entry={dialog?.entry ?? null}
        defaultDate={dialog?.date ?? today}
        open={!!dialog}
        onClose={() => setDialog(null)}
      />
      <DeleteConfirmationDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete entry?"
        description={toDelete?.recurring ? `"${toDelete.title}" repeats every week; all of its dates will be removed.` : `"${toDelete?.title}" will be removed from the calendar.`}
        isLoading={deleteEntry.isPending}
        onConfirm={() =>
          toDelete &&
          deleteEntry.mutate(toDelete.id, {
            onSuccess: () => {
              toast.success("Entry deleted.");
              setToDelete(null);
            },
          })
        }
      />
    </div>
  );
};

export default AdminCalendar;
