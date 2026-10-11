import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useGetPTMEvents, useGenerateSlots, useGetMyPTMAgenda } from "@/pages/admin/ptm/service/ptm-service";
import { useGetMyTeacherAssignments } from "@/pages/admin/classes/service/academics-service";
import { useAuth } from "@/context/auth-context";
import { useError } from "@/hooks";

const useTeacherPTMController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();
  const { user } = useAuth();
  const org = organizationId || "";

  const [selectedEventId, setSelectedEventId] = useState("");
  const [slotForm, setSlotForm] = useState({ sectionId: "", startAt: "", endAt: "" });

  const getPTMEvents = useGetPTMEvents(org);
  const getMyAgenda = useGetMyPTMAgenda(org);
  const getMyAssignments = useGetMyTeacherAssignments(org);
  const generateSlots = useGenerateSlots(org);

  useError({ mutation: generateSlots });

  const events = getPTMEvents.data?.items || [];
  const agenda = getMyAgenda.data?.items || [];
  const selectedEvent = events.find((e) => e.id === selectedEventId);
  // the sections of this event that the teacher teaches, each listed once and named with its class
  const eventSectionOptions = [
    ...new Map(
      (getMyAssignments.data?.items || [])
        .filter((a) => a.sectionId && selectedEvent?.sectionIds.includes(a.sectionId.id))
        .map((a) => [a.sectionId.id, { id: a.sectionId.id, name: `${a.classId?.name ?? ""} - ${a.sectionId.name}` }])
    ).values(),
  ];

  const handleSlotFormChange = (field: string, value: string) => {
    setSlotForm({ ...slotForm, [field]: value });
  };

  const handleGenerateSlots = () => {
    if (!selectedEventId || !slotForm.sectionId || !slotForm.startAt || !slotForm.endAt || !user?.id) {
      toast.error("Select an event, section and time window.");
      return;
    }
    generateSlots.mutate(
      { ptmEventId: selectedEventId, teacherUserId: user.id, ...slotForm },
      {
        onSuccess: () => {
          toast.success("Slots generated.");
          setSlotForm({ sectionId: "", startAt: "", endAt: "" });
        },
      }
    );
  };

  return {
    t,
    events,
    agenda,
    eventSectionOptions,
    isLoadingAgenda: getMyAgenda.isLoading,
    isGeneratingSlots: generateSlots.isPending,
    selectedEventId,
    setSelectedEventId,
    slotForm,
    handleSlotFormChange,
    handleGenerateSlots,
  };
};

export default useTeacherPTMController;
