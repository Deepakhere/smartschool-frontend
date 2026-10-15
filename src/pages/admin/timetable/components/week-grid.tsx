import { XMarkIcon } from "@heroicons/react/24/outline";

import { ITimetableSlot } from "@/types";
import { DAY_NAMES, formatTime, periodRows, weekDays } from "../timetable.utils";

interface WeekGridProps {
  slots: ITimetableSlot[];
  // the teacher's own week shows which class each period is with, instead of who teaches it
  showSection?: boolean;
  onDelete?: (slot: ITimetableSlot) => void;
}

const WeekGrid = ({ slots, showSection = false, onDelete }: WeekGridProps) => {
  const days = weekDays(slots);
  const rows = periodRows(slots);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <th className="w-32 border-b border-r border-gray-200 px-3 py-2 text-left font-semibold">Time</th>
            {days.map((day) => (
              <th key={day} className="min-w-[140px] border-b border-gray-200 px-3 py-2 text-left font-semibold">
                {DAY_NAMES[day].slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const [start, end] = row.split("-");
            return (
              <tr key={row}>
                <td className="border-b border-r border-gray-100 px-3 py-2 align-top text-xs font-medium text-gray-600">
                  {formatTime(start)}
                  <span className="block text-gray-400">{formatTime(end)}</span>
                </td>
                {days.map((day) => {
                  const here = slots.filter((slot) => slot.dayOfWeek === day && slot.startTime === start && slot.endTime === end);
                  return (
                    <td key={day} className="border-b border-gray-100 p-1.5 align-top">
                      {here.map((slot) => (
                        <div key={slot.id} className="group relative mb-1 rounded-md border border-primary-100 bg-primary-50 px-2 py-1.5">
                          <p className="pr-4 text-xs font-semibold text-primary-900">{slot.subjectId?.name ?? "Subject"}</p>
                          <p className="text-[11px] text-gray-600">
                            {showSection
                              ? `${slot.classId?.name ?? ""} ${slot.sectionId?.name ?? ""}`.trim()
                              : slot.teacherUserId?.name}
                            {slot.room ? ` · ${slot.room}` : ""}
                          </p>
                          {onDelete && (
                            <button
                              type="button"
                              aria-label={`Remove ${slot.subjectId?.name ?? "period"} on ${DAY_NAMES[slot.dayOfWeek]}`}
                              onClick={() => onDelete(slot)}
                              className="absolute right-1 top-1 rounded p-0.5 text-gray-400 opacity-0 hover:bg-white hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
                            >
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WeekGrid;
