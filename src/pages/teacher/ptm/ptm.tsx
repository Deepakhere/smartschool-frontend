import Spinner from "../../../components/spinner";
import NoRecordFound from "../../../components/no-record-found";
import CustomSelectDropdown from "../../../components/custom-select";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "../../../components/table";
import { SelectOption } from "../../../types";
import SectionHeader from "../../../components/section-header";
import useTeacherPTMController from "./ptm-controller";

const inputClass =
  "mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm";

const TeacherPTM = () => {
  const {
    t,
    events,
    agenda,
    eventSectionOptions,
    isLoadingAgenda,
    isGeneratingSlots,
    selectedEventId,
    setSelectedEventId,
    slotForm,
    handleSlotFormChange,
    handleGenerateSlots,
  } = useTeacherPTMController();

  const eventOptions: SelectOption[] = events.map((event) => ({
    id: event.id,
    name: `${event.title} (${new Date(event.date).toLocaleDateString()})`,
  }));
  const sectionOptions: SelectOption[] = eventSectionOptions.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Parent-Teacher Meetings"
        description="Open your availability for parents to book, and track your agenda"
      />
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Open my availability</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <CustomSelectDropdown
            options={eventOptions}
            placeholder="Select PTM event"
            value={eventOptions.find((o) => o.id === selectedEventId) || null}
            onChange={(o) => setSelectedEventId(String(o.id))}
          />
          <CustomSelectDropdown
            options={sectionOptions}
            placeholder="Section"
            value={sectionOptions.find((o) => o.id === slotForm.sectionId) || null}
            onChange={(o) => handleSlotFormChange("sectionId", String(o.id))}
          />
          <input
            type="datetime-local"
            className={inputClass}
            value={slotForm.startAt}
            onChange={(e) => handleSlotFormChange("startAt", e.target.value)}
          />
          <input
            type="datetime-local"
            className={inputClass}
            value={slotForm.endAt}
            onChange={(e) => handleSlotFormChange("endAt", e.target.value)}
          />
        </div>
        <button
          onClick={handleGenerateSlots}
          disabled={isGeneratingSlots}
          className="mt-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          Generate slots
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">My agenda</h2>
        {isLoadingAgenda ? (
          <Spinner />
        ) : agenda.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Time</TableHead>
              <TableHead className="text-center">Student</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableHeader>
            <TableBody>
              {agenda.map(({ slot, booking }) => (
                <TableRow key={slot.id}>
                  <TableCell className="font-medium text-gray-900">{new Date(slot.startAt).toLocaleString()}</TableCell>
                  <TableCell className="text-center">{booking && typeof booking.studentId === "object" ? booking.studentId.name : "—"}</TableCell>
                  <TableCell className="text-center">
                    {booking ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Booked</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Open</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TeacherPTM;
