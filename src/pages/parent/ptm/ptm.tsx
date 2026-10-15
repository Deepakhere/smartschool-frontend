import Spinner from "@/components/spinner";
import EmptyState from "@/components/empty-state";
import CustomSelectDropdown from "@/components/custom-select";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableSkeleton } from "@/components/table";
import { SelectOption } from "@/types";
import SectionHeader from "@/components/section-header";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ErrorState from "@/components/error-state";
import FormDialog from "@/components/form-dialog";
import { SelectField } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import useParentPTMController from "./ptm-controller";

const ParentPTM = () => {
  const {
    events,
    slots,
    bookingChildren,
    bookings,
    isLoadingBookings,
    bookingsError,
    retryBookings,
    isLoadingEvents,
    isLoadingSlots,
    isBooking,
    selectedEventId,
    setSelectedEventId,
    bookingSlotId,
    bookingSlot,
    bookingForm,
    openBookingFor,
    closeBooking,
    confirmBooking,
    bookingToCancel,
    setBookingToCancel,
    confirmCancelBooking,
    isCancelling,
  } = useParentPTMController();

  const eventOptions: SelectOption[] = events.map((event) => ({
    id: event.id,
    name: `${event.title} (${new Date(event.date).toLocaleDateString()})`,
  }));
  const childOptions: SelectOption[] = bookingChildren.map((c) => ({ id: c.studentId.id, name: c.studentId.name }));

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Parent-Teacher Meetings"
        description="Book a slot with your child's teacher and track your bookings"
      />
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">My bookings</h2>
        {bookingsError ? (
          <ErrorState error={bookingsError} onRetry={retryBookings} />
        ) : isLoadingBookings ? (
          <Table>
            <TableHeader>
              <TableHead>Student</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-center">Join</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableHeader>
            <TableSkeleton columns={4} />
          </Table>
        ) : bookings.length === 0 ? (
          <EmptyState compact title="No bookings yet" description="Slots you book appear here." />
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
                        <a href={slot.meetingLink} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                          Join link
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {slot && new Date(slot.startAt) > new Date() ? (
                        <Button variant="link" onClick={() => setBookingToCancel(b.id)} className="text-red-600 hover:text-red-800">
                          Cancel
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-400">Past</span>
                      )}
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
          <EmptyState compact title="No meetings open for booking" description="When the school opens parent-teacher meeting slots, you can book one here." />
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
                  <EmptyState compact title="No open slots yet" description="Teachers haven't opened time for your child's section." />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => {
                      const teacherName = typeof slot.teacherUserId === "object" ? slot.teacherUserId.name : "";
                      const full = slot.bookedCount >= slot.capacity;
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          disabled={full}
                          onClick={() => openBookingFor(slot.id)}
                          className={`px-3 py-2 rounded-md text-xs border text-left ${
                            full
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-primary-50"
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

      <FormDialog
        form={bookingForm}
        open={!!bookingSlotId}
        onClose={closeBooking}
        title="Confirm booking"
        description={
          bookingSlot
            ? `${typeof bookingSlot.teacherUserId === "object" ? bookingSlot.teacherUserId.name : ""}, ${new Date(
                bookingSlot.startAt
              ).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}`
            : undefined
        }
        submitLabel="Confirm"
        isSubmitting={isBooking}
        submitDisabled={!childOptions.length}
        onSubmit={confirmBooking}
        className="max-w-sm"
      >
        {childOptions.length ? (
          <SelectField form={bookingForm} name="studentId" label="Booking for" options={childOptions} />
        ) : (
          <p className="text-sm text-gray-600">None of your children are in this slot's section.</p>
        )}
      </FormDialog>

      <DeleteConfirmationDialog
        open={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={confirmCancelBooking}
        isLoading={isCancelling}
        title="Cancel this meeting?"
        description="The slot is freed for other parents. You can book again while slots are open."
        confirmLabel="Cancel meeting"
        cancelLabel="Keep it"
      />
    </div>
  );
};

export default ParentPTM;
