import Spinner from "../../../components/spinner";
import NoRecordFound from "../../../components/no-record-found";
import CustomSelectDropdown from "../../../components/custom-select";
import DatePicker from "../../../components/date-picker";
import { SelectOption } from "../../../types";
import { usePageHeader } from "../../../hooks";
import SectionHeader from "../../../components/section-header";
import usePTMController from "./ptm-controller";

const inputClass =
  "mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm";

const modeOptions: SelectOption[] = [
  { id: "onsite", name: "Onsite" },
  { id: "online", name: "Online" },
];

const AdminPTM = () => {
  const {
    t,
    events,
    classOptions,
    sectionOptions,
    teacherAssignments,
    slotsForExpandedEvent,
    isLoadingEvents,
    isCreatingEvent,
    isGeneratingSlots,
    isCreateModalOpen,
    setIsCreateModalOpen,
    expandedEventId,
    toggleExpand,
    form,
    sectionIds,
    toggleSection,
    handleFormChange,
    slotForm,
    handleSlotFormChange,
    handleCreateEvent,
    handleGenerateSlots,
  } = usePTMController();

  usePageHeader({
    actions: (
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Schedule PTM
      </button>
    ),
  });

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Parent-Teacher Meetings"
        description="Schedule PTM events, open teacher availability, and track parent bookings"
      />

      {isCreateModalOpen && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-indigo-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">New PTM Event</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
              />
            </div>
            <DatePicker label="Date" value={form.date} onChange={(value) => handleFormChange("date", value)} />
            <CustomSelectDropdown
              label="Mode"
              options={modeOptions}
              value={modeOptions.find((o) => o.id === form.mode) || modeOptions[0]}
              onChange={(o) => handleFormChange("mode", String(o.id))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Slot duration (mins)</label>
              <input
                type="number"
                className={inputClass}
                value={form.slotDurationMins}
                onChange={(e) => handleFormChange("slotDurationMins", Number(e.target.value))}
              />
            </div>
            {form.mode === "onsite" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Venue</label>
                <input className={inputClass} value={form.venue} onChange={(e) => handleFormChange("venue", e.target.value)} />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Meeting link</label>
                <input
                  className={inputClass}
                  value={form.defaultMeetingLink}
                  onChange={(e) => handleFormChange("defaultMeetingLink", e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sections</label>
            <div className="flex flex-wrap gap-2">
              {sectionOptions.length === 0 && <p className="text-sm text-gray-500">No sections found.</p>}
              {sectionOptions.map((s) => {
                const cls = classOptions.find((c) => c.id === s.classId);
                const selected = sectionIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSection(s.id)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      selected ? "bg-indigo-100 text-indigo-800 border-indigo-300" : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {cls?.name || ""} - {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={handleCreateEvent}
              disabled={isCreatingEvent}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        {isLoadingEvents ? (
          <Spinner />
        ) : events.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event.id} className="p-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(event.id)}>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()} · {event.mode} · {event.slotDurationMins} min slots
                    </p>
                  </div>
                  <span className="text-sm text-indigo-600">{expandedEventId === event.id ? "Hide" : "Manage slots"}</span>
                </div>

                {expandedEventId === event.id && (
                  <div className="mt-4 bg-gray-50 rounded-md p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Generate slots for a teacher</p>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      {(() => {
                        const teacherOptions: SelectOption[] = teacherAssignments
                          .filter((a) => event.sectionIds.includes(a.sectionId.id))
                          .map((a) => ({ id: a.teacherUserId.id, name: `${a.teacherUserId.name} (${a.sectionId.name})` }));
                        const eventSectionOptions: SelectOption[] = sectionOptions
                          .filter((s) => event.sectionIds.includes(s.id))
                          .map((s) => ({ id: s.id, name: s.name }));
                        return (
                          <>
                            <CustomSelectDropdown
                              options={teacherOptions}
                              placeholder="Teacher"
                              value={teacherOptions.find((o) => o.id === slotForm.teacherUserId) || null}
                              onChange={(o) => handleSlotFormChange("teacherUserId", String(o.id))}
                            />
                            <CustomSelectDropdown
                              options={eventSectionOptions}
                              placeholder="Section"
                              value={eventSectionOptions.find((o) => o.id === slotForm.sectionId) || null}
                              onChange={(o) => handleSlotFormChange("sectionId", String(o.id))}
                            />
                          </>
                        );
                      })()}
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
                      onClick={() => handleGenerateSlots(event.id)}
                      disabled={isGeneratingSlots}
                      className="mt-3 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Generate slots
                    </button>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Existing slots ({slotsForExpandedEvent.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {slotsForExpandedEvent.map((slot) => (
                          <span
                            key={slot.id}
                            className={`px-2 py-1 rounded text-xs border ${
                              slot.bookedCount >= slot.capacity
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-green-50 text-green-700 border-green-200"
                            }`}
                          >
                            {new Date(slot.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} (
                            {slot.bookedCount}/{slot.capacity})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPTM;
