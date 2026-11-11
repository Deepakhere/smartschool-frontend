import DataTable from "@/shared/ui/data-table";
import { useIsDesktop } from "@/shared/lib/hooks/is-desktop";
import { ITimetableSlot } from "@/entities/timetable";
import { periodRows, weekDays } from "../timetable.utils";
import DayList from "./day-list";
import { weekGridColumns } from "./week-grid-columns";

interface WeekGridProps {
  slots: ITimetableSlot[];
  isLoading: boolean;
  emptyDescription: string;
  showSection?: boolean;
  onDelete?: (slot: ITimetableSlot) => void;
}

const WeekGrid = ({ slots, isLoading, emptyDescription, showSection = false, onDelete }: WeekGridProps) => {
  const isDesktop = useIsDesktop();
  if (!isDesktop && !isLoading) {
    return <DayList slots={slots} showSection={showSection} emptyDescription={emptyDescription} onDelete={onDelete} />;
  }
  return (
    <DataTable
      columns={weekGridColumns({ slots, days: weekDays(slots), showSection, onDelete })}
      data={periodRows(slots)}
      getRowId={(period) => period}
      isLoading={isLoading}
      empty={{ title: "No periods yet", description: emptyDescription }}
    />
  );
};

export default WeekGrid;
