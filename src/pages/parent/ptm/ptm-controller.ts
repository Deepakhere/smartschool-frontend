import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  useGetPTMEvents,
  useGetSlotsForEvent,
  useBookPTMSlot,
  useCancelPTMBooking,
  useGetMyPTMBookings,
} from "@/pages/admin/ptm/service/ptm-service";
import { useGetMyChildren } from "./service/my-children-service";
import { useError } from "@/hooks";

const useParentPTMController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();
  const org = organizationId || "";

  const [selectedEventId, setSelectedEventId] = useState("");
  const [bookingSlotId, setBookingSlotId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
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

  const openBookingFor = (slotId: string) => {
    setBookingSlotId(slotId);
    setSelectedStudentId(childrenForSlot(slotId)[0]?.studentId.id || "");
  };

  const closeBooking = () => setBookingSlotId("");

  const confirmBooking = () => {
    if (!selectedStudentId) {
      toast.error("Select a child to book for.");
      return;
    }
    bookSlot.mutate(
      { slotId: bookingSlotId, studentId: selectedStudentId, ptmEventId: selectedEventId },
      {
        onSuccess: () => {
          toast.success("Slot booked! Check your email for confirmation.");
          setBookingSlotId("");
        },
      }
    );
  };

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
    bookingChildren,
    bookings,
    isLoadingBookings: getMyBookings.isLoading,
    isLoadingEvents: getPTMEvents.isLoading,
    isLoadingSlots: getSlotsForEvent.isLoading,
    isBooking: bookSlot.isPending,
    selectedEventId,
    setSelectedEventId,
    bookingSlotId,
    selectedStudentId,
    setSelectedStudentId,
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
