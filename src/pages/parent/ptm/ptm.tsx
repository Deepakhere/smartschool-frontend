import CustomSelectDropdown from "@/components/custom-select";
import DataTable from "@/components/data-table";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import FormDialog from "@/components/form-dialog";
import { SelectField } from "@/components/form-fields";
import SectionHeader from "@/components/section-header";
import Spinner from "@/components/spinner";
import { bookingColumns } from "./ptm-columns";
import useParentPTMController from "./ptm-controller";

const ParentPTM = () => {
  const {
    events,
    slots,
    eventOptions,
    childOptions,
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

  const columns = bookingColumns(setBookingToCancel);

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Parent-Teacher Meetings"
        description="Book a slot with your child's teacher and track your bookings"
      />
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">My bookings</h2>
        {bookingsError ? (
          <ErrorState error={bookingsError} onRetry={retryBookings} />
        ) : (
          <DataTable
            columns={columns}
            data={bookings}
            getRowId={(booking) => booking.id}
            isLoading={isLoadingBookings}
            empty={{ title: "No bookings yet", description: "Slots you book appear here." }}
          />
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
