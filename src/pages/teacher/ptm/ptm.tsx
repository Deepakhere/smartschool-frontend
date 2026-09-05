import LogoSpinner from "../../../components/logo-spinner";
import NoRecordFound from "../../../components/no-record-found";
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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Parent-Teacher Meetings</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Open my availability</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select className={inputClass} value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
            <option value="">Select PTM event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({new Date(event.date).toLocaleDateString()})
              </option>
            ))}
          </select>
          <select
            className={inputClass}
            value={slotForm.sectionId}
            onChange={(e) => handleSlotFormChange("sectionId", e.target.value)}
          >
            <option value="">Section</option>
            {eventSectionOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
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
          <LogoSpinner offsetSidebar />
        ) : agenda.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <div className="space-y-2">
            {agenda.map(({ slot, booking }) => (
              <div key={slot.id} className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-gray-700">
                  {new Date(slot.startAt).toLocaleString()}
                </span>
                {booking ? (
                  <span className="text-sm font-medium text-gray-900">
                    {typeof booking.studentId === "object" ? booking.studentId.name : "Booked"}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Open</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPTM;
