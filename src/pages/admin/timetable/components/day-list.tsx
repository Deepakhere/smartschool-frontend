import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import EmptyState from "@/shared/ui/empty-state";
import { Button } from "@/shared/ui/kit/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/kit/tabs";
import { ITimetableSlot } from "@/entities/timetable";
import { DAY_NAMES, formatTime, periodRows, weekDays } from "../timetable.utils";

interface DayListProps {
  slots: ITimetableSlot[];
  showSection: boolean;
  emptyDescription: string;
  onDelete?: (slot: ITimetableSlot) => void;
}

// the phone and tablet view of a week: pick a day, see its periods in order
const DayList = ({ slots, showSection, emptyDescription, onDelete }: DayListProps) => {
  const days = weekDays(slots);
  const today = new Date().getDay();
  const [picked, setPicked] = useState<number | null>(null);
  const day = picked !== null && days.includes(picked) ? picked : days.includes(today) ? today : days[0];

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <EmptyState title="No periods yet" description={emptyDescription} />
      </div>
    );
  }

  const periods = periodRows(slots).filter((period) => {
    const [start, end] = period.split("-");
    return slots.some((slot) => slot.dayOfWeek === day && slot.startTime === start && slot.endTime === end);
  });

  return (
    <div className="space-y-3">
      <Tabs value={String(day)} onValueChange={(value) => setPicked(Number(value))}>
        <TabsList aria-label="Day of the week" className="flex w-full">
          {days.map((d) => (
            <TabsTrigger key={d} value={String(d)} className="flex-1 px-2">
              {DAY_NAMES[d].slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {periods.length === 0 && (
        <p className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
          No periods on {DAY_NAMES[day]}.
        </p>
      )}
      <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
        {periods.map((period) => {
          const [start, end] = period.split("-");
          return slots
            .filter((slot) => slot.dayOfWeek === day && slot.startTime === start && slot.endTime === end)
            .map((slot) => (
              <li key={slot.id} className="flex items-center gap-4 px-4 py-3">
                <div className="w-20 shrink-0 text-xs font-medium text-gray-600">
                  {formatTime(start)}
                  <span className="block text-gray-400">{formatTime(end)}</span>
                </div>
                <div className="min-w-0 flex-1 rounded-md border border-primary-100 bg-primary-50 px-3 py-2">
                  <p className="text-sm font-semibold text-primary-900">{slot.subjectId?.name ?? "Subject"}</p>
                  <p className="text-xs text-gray-600">
                    {showSection
                      ? `${slot.classId?.name ?? ""} ${slot.sectionId?.name ?? ""}`.trim()
                      : slot.teacherUserId?.name}
                    {slot.room ? ` · ${slot.room}` : ""}
                  </p>
                </div>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${slot.subjectId?.name ?? "period"} on ${DAY_NAMES[slot.dayOfWeek]}`}
                    onClick={() => onDelete(slot)}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ));
        })}
      </ul>
    </div>
  );
};

export default DayList;
