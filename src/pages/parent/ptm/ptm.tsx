import LogoSpinner from "../../../components/logo-spinner";
import NoRecordFound from "../../../components/no-record-found";
import useParentPTMController from "./ptm-controller";

const inputClass =
  "mt-1 block w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm";

const ParentPTM = () => {
  const {
    t,
    events,
    slots,
    children,
    bookings,
    isLoadingEvents,
    isLoadingSlots,
    isBooking,
    selectedEventId,
    setSelectedEventId,
    bookingSlotId,
    selectedStudentId,
    setSelectedStudentId,
    openBookingFor,
    closeBooking,
    confirmBooking,
    handleCancelBooking,
  } = useParentPTMController();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Parent-Teacher Meetings</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">My bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const slot = typeof b.slotId === "object" ? b.slotId : null;
              return (
                <div key={b.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {typeof b.studentId === "object" ? b.studentId.name : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slot ? new Date(slot.startAt).toLocaleString() : ""}
                      {slot?.meetingLink && (
                        <>
                          {" "}
                          ·{" "}
                          <a href={slot.meetingLink} target="_blank" rel="noreferrer" className="text-indigo-600">
                            Join link
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Cancel
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Book a slot</h2>
        {isLoadingEvents ? (
          <LogoSpinner offsetSidebar />
        ) : events.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <>
            <select className={inputClass} value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
              <option value="">Select PTM event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} ({new Date(event.date).toLocaleDateString()})
                </option>
              ))}
            </select>

            {selectedEventId && (
              <div className="mt-4">
                {isLoadingSlots ? (
                  <LogoSpinner offsetSidebar />
                ) : slots.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-2">No open slots for your child's section yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => {
                      const teacherName = typeof slot.teacherUserId === "object" ? slot.teacherUserId.name : "";
                      const full = slot.bookedCount >= slot.capacity;
                      return (
                        <button
                          key={slot.id}
                          disabled={full}
                          onClick={() => openBookingFor(slot.id)}
                          className={`px-3 py-2 rounded-md text-xs border text-left ${
                            full
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
                          }`}
                        >
                          <div className="font-medium">{teacherName}</div>
                          <div>{new Date(slot.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {bookingSlotId && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm booking</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking for</label>
            <select
              className={inputClass}
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {children.map((c) => (
                <option key={c.studentId.id} value={c.studentId.id}>
                  {c.studentId.name}
                </option>
              ))}
            </select>
            <div className="mt-5 flex gap-2">
              <button
                onClick={confirmBooking}
                disabled={isBooking}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={closeBooking}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentPTM;
