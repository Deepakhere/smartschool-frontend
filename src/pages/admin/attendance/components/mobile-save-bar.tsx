import { Button } from "@/shared/ui/kit/button";
import { AttendanceStatus } from "@/entities/attendance";

interface MobileSaveBarProps {
  counts: Record<AttendanceStatus, number>;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
}

const TALLY: { key: AttendanceStatus; label: string; className: string }[] = [
  { key: "present", label: "P", className: "text-green-700" },
  { key: "absent", label: "A", className: "text-red-600" },
  { key: "late", label: "L", className: "text-amber-600" },
  { key: "excused", label: "E", className: "text-gray-600" },
];

// phones and tablets: the tally and Save stay in reach while a long list is marked
const MobileSaveBar = ({ counts, isDirty, isSaving, onSave }: MobileSaveBarProps) => (
  <div className="sticky bottom-0 z-20 -mx-4 flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] sm:-mx-6 sm:px-6">
    <div>
      <p className="flex gap-3 text-sm font-semibold">
        {TALLY.map(({ key, label, className }) => (
          <span key={key} className={className}>
            {label} {counts[key]}
          </span>
        ))}
      </p>
      <p className={isDirty ? "text-xs font-medium text-amber-600" : "text-xs text-gray-500"}>
        {isDirty ? "Unsaved changes" : "Up to date"}
      </p>
    </div>
    <Button variant="primary" loading={isSaving} onClick={onSave}>
      Save attendance
    </Button>
  </div>
);

export default MobileSaveBar;
