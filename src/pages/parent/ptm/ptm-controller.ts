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
} from "../../admin/ptm/service/ptm-service";
import { useGetMyChildren } from "./service/my-children-service";
import { useError } from "../../../hooks";

const useParentPTMController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();
  const org = organizationId || "";

  const [selectedEventId, setSelectedEventId] = useState("");
  const [bookingSlotId, setBookingSlotId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

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

  const openBookingFor = (slotId: string) => {
    setBookingSlotId(slotId);
    setSelectedStudentId(children[0]?.studentId.id || "");
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

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking.mutate(bookingId, {
      onSuccess: () => {
        toast.success("Booking cancelled.");
      },
    });
  };

  return {
    t,
    events,
    slots,
    children,
    bookings,
    isLoadingEvents: getPTMEvents.isLoading,
    isLoadingSlots: getSlotsForEvent.isLoading,
    isBooking: bookSlot.isLoading,
    selectedEventId,
    setSelectedEventId,
    bookingSlotId,
    selectedStudentId,
    setSelectedStudentId,
    openBookingFor,
    closeBooking,
    confirmBooking,
    handleCancelBooking,
  };
};

export default useParentPTMController;
