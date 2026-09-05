import LogoSpinner from "../../../components/logo-spinner";
import NoRecordFound from "../../../components/no-record-found";
import usePTMController from "./ptm-controller";

const inputClass =
  "mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm";

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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Parent-Teacher Meetings</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Schedule PTM
        </button>
      </div>

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
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className={inputClass}
                value={form.date}
                onChange={(e) => handleFormChange("date", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode</label>
              <select className={inputClass} value={form.mode} onChange={(e) => handleFormChange("mode", e.target.value)}>
                <option value="onsite">Onsite</option>
                <option value="online">Online</option>
              </select>
            </div>
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
          <LogoSpinner offsetSidebar />
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
                      <select
                        className={inputClass}
                        value={slotForm.teacherUserId}
                        onChange={(e) => handleSlotFormChange("teacherUserId", e.target.value)}
                      >
                        <option value="">Teacher</option>
                        {teacherAssignments
                          .filter((a) => event.sectionIds.includes(a.sectionId.id))
                          .map((a) => (
                            <option key={a.id} value={a.teacherUserId.id}>
                              {a.teacherUserId.name} ({a.sectionId.name})
                            </option>
                          ))}
                      </select>
                      <select
                        className={inputClass}
                        value={slotForm.sectionId}
                        onChange={(e) => handleSlotFormChange("sectionId", e.target.value)}
                      >
                        <option value="">Section</option>
                        {sectionOptions
                          .filter((s) => event.sectionIds.includes(s.id))
                          .map((s) => (
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
