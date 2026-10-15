import { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import ErrorState from "@/components/error-state";
import Spinner from "@/components/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AttendanceStatus } from "@/types";
import { exportToCsv, localDateString } from "@/utils";
import { IMonthRegisterRow, useGetMonthRegister } from "../service/attendance-service";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MARKS: Record<AttendanceStatus, { letter: string; className: string }> = {
  present: { letter: "P", className: "text-green-700" },
  absent: { letter: "A", className: "text-red-600" },
  late: { letter: "L", className: "text-amber-600" },
  excused: { letter: "E", className: "text-gray-500" },
};

const SUMMARY_COLUMNS: { key: keyof IMonthRegisterRow["summary"]; label: string }[] = [
  { key: "present", label: "Present" },
  { key: "absent", label: "Absent" },
  { key: "late", label: "Late" },
  { key: "excused", label: "Excused" },
  { key: "holiday", label: "Holiday" },
  { key: "missing", label: "Missing" },
];

interface MonthlyRegisterProps {
  organizationId: string;
  sectionId: string;
  month: string;
  sectionLabel: string;
}

const MonthlyRegister = ({ organizationId, sectionId, month, sectionLabel }: MonthlyRegisterProps) => {
  const register = useGetMonthRegister(organizationId, sectionId, month);
  const [search, setSearch] = useState("");
  const [showHolidays, setShowHolidays] = useState(true);
  const today = localDateString();

  const days = (register.data?.days ?? []).filter((day) => showHolidays || !day.isHoliday);
  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const items = register.data?.items ?? [];
    return term ? items.filter((row) => `${row.studentName} ${row.rollNumber}`.toLowerCase().includes(term)) : items;
  }, [register.data, search]);

  const exportCsv = () =>
    exportToCsv(
      `attendance-${sectionLabel.replace(/\s+/g, "-").toLowerCase()}-${month}`,
      rows.map((row) => ({
        roll_number: row.rollNumber,
        student: row.studentName,
        ...Object.fromEntries(
          (register.data?.days ?? []).map((day) => [day.date, row.cells[day.date] ? MARKS[row.cells[day.date]].letter : day.isHoliday ? "H" : ""])
        ),
        ...Object.fromEntries(SUMMARY_COLUMNS.map((column) => [column.key, row.summary[column.key]])),
        attendance_percent: row.summary.percent,
      }))
    );

  if (register.isError) return <ErrorState error={register.error} onRetry={() => register.refetch()} />;

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-4 py-3">
        <div className="relative w-64">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students" className="pl-9" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <Checkbox checked={showHolidays} onChange={(event) => setShowHolidays(event.target.checked)} />
          Show holidays
        </label>
        <span className="text-sm text-gray-500">{register.data ? `${register.data.schoolDays} school day(s) so far` : ""}</span>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!rows.length}
          className="ml-auto inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      {register.isLoading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <p className="px-4 py-5 text-sm text-gray-500">{search ? "No students match your search." : "No students in this section."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <th className="sticky left-0 z-10 min-w-[160px] border-b border-r border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold">Student</th>
                {days.map((day) => (
                  <th
                    key={day.date}
                    className={cn("min-w-[30px] border-b border-gray-200 px-1 py-1.5 text-center font-semibold", day.isHoliday && "bg-red-50 text-red-500")}
                  >
                    <div className="text-gray-700">{Number(day.date.slice(8))}</div>
                    <div className="text-[10px] font-normal">{WEEKDAYS[day.weekday]}</div>
                  </th>
                ))}
                {SUMMARY_COLUMNS.map((column, index) => (
                  <th key={column.key} className={cn("border-b border-gray-200 px-2 py-2 text-center font-semibold", index === 0 && "border-l")}>
                    {column.label}
                  </th>
                ))}
                <th className="sticky right-0 z-10 border-b border-l border-gray-200 bg-gray-50 px-3 py-2 text-center font-semibold">Att %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.studentId} className="hover:bg-gray-50">
                  <td className="sticky left-0 z-10 border-b border-r border-gray-100 bg-white px-3 py-2">
                    <p className="font-medium text-gray-900">{row.studentName}</p>
                    {row.rollNumber && <p className="text-xs text-gray-400">Roll {row.rollNumber}</p>}
                  </td>
                  {days.map((day) => {
                    const status = row.cells[day.date];
                    return (
                      <td
                        key={day.date}
                        className={cn(
                          "border-b border-gray-100 text-center text-xs font-semibold",
                          day.isHoliday && "bg-red-50/60",
                          !status && day.date > today && "bg-gray-50/60"
                        )}
                      >
                        {status ? <span className={MARKS[status].className}>{MARKS[status].letter}</span> : <span className="text-gray-300">-</span>}
                      </td>
                    );
                  })}
                  {SUMMARY_COLUMNS.map((column, index) => (
                    <td key={column.key} className={cn("border-b border-gray-100 px-2 text-center font-medium text-gray-800", index === 0 && "border-l")}>
                      {row.summary[column.key]}
                    </td>
                  ))}
                  <td className={cn("sticky right-0 z-10 border-b border-l border-gray-100 bg-white px-3 text-center font-semibold", row.summary.percent < 75 ? "text-red-600" : "text-gray-900")}>
                    {row.summary.percent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-3 text-xs text-gray-500">
            P present · A absent · L late · E excused · red columns are holidays from the school calendar. Late and excused count as attended.
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthlyRegister;
