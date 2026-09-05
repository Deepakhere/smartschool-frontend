import Spinner from "../../../components/spinner";
import NoRecordFound from "../../../components/no-record-found";
import CustomSelectDropdown from "../../../components/custom-select";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "../../../components/table";
import { SelectOption } from "../../../types";
import SectionHeader from "../../../components/section-header";
import useParentPTMController from "./ptm-controller";

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

  const eventOptions: SelectOption[] = events.map((event) => ({
    id: event.id,
    name: `${event.title} (${new Date(event.date).toLocaleDateString()})`,
  }));
  const childOptions: SelectOption[] = children.map((c) => ({ id: c.studentId.id, name: c.studentId.name }));

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Parent-Teacher Meetings"
        description="Book a slot with your child's teacher and track your bookings"
      />
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">My bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Student</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-center">Join</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => {
                const slot = typeof b.slotId === "object" ? b.slotId : null;
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium text-gray-900">
                      {typeof b.studentId === "object" ? b.studentId.name : ""}
                    </TableCell>
                    <TableCell className="text-center">{slot ? new Date(slot.startAt).toLocaleString() : ""}</TableCell>
                    <TableCell className="text-center">
                      {slot?.meetingLink ? (
                        <a href={slot.meetingLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                          Join link
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => handleCancelBooking(b.id)} className="text-sm text-red-600 hover:text-red-800">
                        Cancel
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Book a slot</h2>
        {isLoadingEvents ? (
          <Spinner />
        ) : events.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <>
            <CustomSelectDropdown
              options={eventOptions}
              placeholder="Select PTM event"
              value={eventOptions.find((o) => o.id === selectedEventId) || null}
              onChange={(o) => setSelectedEventId(String(o.id))}
            />

            {selectedEventId && (
              <div className="mt-4">
                {isLoadingSlots ? (
                  <Spinner />
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
            <CustomSelectDropdown
              label="Booking for"
              options={childOptions}
              value={childOptions.find((o) => o.id === selectedStudentId) || childOptions[0] || null}
              onChange={(o) => setSelectedStudentId(String(o.id))}
            />
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
