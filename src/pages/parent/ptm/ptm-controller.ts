import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useGetPTMEvents,
  useGetSlotsForEvent,
  useBookPTMSlot,
  useCancelPTMBooking,
  useGetMyPTMBookings,
} from "@/pages/admin/ptm/service/ptm-service";
import { useGetMyChildren } from "./service/my-children-service";
import { useError } from "@/hooks";
import { SelectOption } from "@/types";

const bookingSchema = z.object({ studentId: z.string().min(1, "Select a child to book for.") });

const useParentPTMController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();
  const org = organizationId || "";

  const [selectedEventId, setSelectedEventId] = useState("");
  const [bookingSlotId, setBookingSlotId] = useState("");
  const bookingForm = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { studentId: "" },
  });
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const getPTMEvents = useGetPTMEvents(org);
  const getSlotsForEvent = useGetSlotsForEvent(org, selectedEventId);
  const getMyChildren = useGetMyChildren(org);
  const getMyBookings = useGetMyPTMBookings(org);
  const bookSlot = useBookPTMSlot(org);
  const cancelBooking = useCancelPTMBooking(org);

  useError({ mutation: bookSlot });
  useError({ mutation: cancelBooking });

  const events = getPTMEvents.data?.items || [];
  const slots = getSlotsForEvent.data?.items || [];
  const children = getMyChildren.data?.items || [];
  const bookings = getMyBookings.data?.items || [];

  // a slot belongs to one section, so only the children in that section can be booked into it
  const childrenForSlot = (slotId: string) => {
    const slot = slots.find((s) => s.id === slotId);
    return children.filter((c) => c.studentId.currentEnrollment?.sectionId?.id === slot?.sectionId);
  };
  const bookingChildren = bookingSlotId ? childrenForSlot(bookingSlotId) : [];
  const bookingSlot = slots.find((s) => s.id === bookingSlotId) ?? null;

  const eventOptions: SelectOption[] = events.map((event) => ({
    id: event.id,
    name: `${event.title} (${new Date(event.date).toLocaleDateString()})`,
  }));
  const childOptions: SelectOption[] = bookingChildren.map((c) => ({ id: c.studentId.id, name: c.studentId.name }));

  const openBookingFor = (slotId: string) => {
    setBookingSlotId(slotId);
    bookingForm.reset({ studentId: childrenForSlot(slotId)[0]?.studentId.id || "" });
  };

  const closeBooking = () => setBookingSlotId("");

  const confirmBooking = bookingForm.handleSubmit(({ studentId }) => {
    bookSlot.mutate(
      { slotId: bookingSlotId, studentId, ptmEventId: selectedEventId },
      {
        onSuccess: () => {
          toast.success("Slot booked! Check your email for confirmation.");
          setBookingSlotId("");
        },
      }
    );
  });

  const confirmCancelBooking = () => {
    if (!bookingToCancel) return;
    cancelBooking.mutate(bookingToCancel, {
      onSuccess: () => {
        toast.success("Booking cancelled.");
        setBookingToCancel(null);
      },
    });
  };

  return {
    t,
    events,
    slots,
    eventOptions,
    childOptions,
    bookings,
    isLoadingBookings: getMyBookings.isLoading,
    bookingsError: getMyBookings.isError ? getMyBookings.error : null,
    retryBookings: () => getMyBookings.refetch(),
    isLoadingEvents: getPTMEvents.isLoading,
    isLoadingSlots: getSlotsForEvent.isLoading,
    isBooking: bookSlot.isPending,
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
    isCancelling: cancelBooking.isPending,
  };
};

export default useParentPTMController;
