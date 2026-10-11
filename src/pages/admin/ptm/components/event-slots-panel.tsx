import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { SelectField, TextField } from "@/components/form-fields";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useError } from "@/hooks";
import { IPTMEvent, ITeacherAssignment, SelectOption } from "@/types";
import { defaultSlotWindowValues, slotWindowSchema, SlotWindowFormValues } from "../ptm.schema";
import { useGenerateSlots, useGetSlotsForEvent } from "../service/ptm-service";

interface EventSlotsPanelProps {
  organizationId: string;
  event: IPTMEvent;
  assignments: ITeacherAssignment[];
}

// open a teacher's slots for one event, and see the slots it already has
const EventSlotsPanel = ({ organizationId, event, assignments }: EventSlotsPanelProps) => {
  const slots = useGetSlotsForEvent(organizationId, event.id);
  const generateSlots = useGenerateSlots(organizationId);
  useError({ mutation: generateSlots });

  const form = useForm<SlotWindowFormValues>({ resolver: zodResolver(slotWindowSchema), defaultValues: defaultSlotWindowValues });
  const teacherUserId = useWatch({ control: form.control, name: "teacherUserId" });

  const eventAssignments = assignments.filter((a) => a.sectionId && event.sectionIds.includes(a.sectionId.id));
  const teacherOptions: SelectOption[] = [
    ...new Map(eventAssignments.map((a) => [a.teacherUserId.id, { id: a.teacherUserId.id, name: a.teacherUserId.name }])).values(),
  ];
  // only the event's sections this teacher teaches
  const sectionOptions: SelectOption[] = [
    ...new Map(
      eventAssignments
        .filter((a) => a.teacherUserId.id === teacherUserId)
        .map((a) => [a.sectionId.id, { id: a.sectionId.id, name: `${a.classId?.name ?? ""} - ${a.sectionId.name}` }])
    ).values(),
  ];

  const onTeacherChange = (id: string) => {
    const sections = eventAssignments.filter((a) => a.teacherUserId.id === id);
    const unique = new Set(sections.map((a) => a.sectionId.id));
    form.setValue("sectionId", unique.size === 1 ? [...unique][0] : "");
  };

  const onSubmit = form.handleSubmit((values) =>
    generateSlots.mutate(
      { ptmEventId: event.id, ...values },
      {
        onSuccess: () => {
          toast.success("Slots generated.");
          form.reset(defaultSlotWindowValues);
        },
      }
    )
  );

  const items = slots.data?.items ?? [];

  return (
    <div className="mt-4 rounded-md bg-gray-50 p-4">
      <p className="mb-2 text-sm font-medium text-gray-700">Generate slots for a teacher</p>
      {teacherOptions.length === 0 ? (
        <p className="text-sm text-gray-500">No teacher is assigned to this event's sections yet (Academics, Teacher assignments).</p>
      ) : (
        <Form {...form}>
          <form onSubmit={onSubmit} noValidate>
            <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-4">
              <SelectField form={form} name="teacherUserId" label="Teacher" options={teacherOptions} onValueChange={onTeacherChange} />
              <SelectField form={form} name="sectionId" label="Section" options={sectionOptions} disabled={!teacherUserId} />
              <TextField form={form} name="startAt" label="From" type="datetime-local" />
              <TextField form={form} name="endAt" label="To" type="datetime-local" />
            </div>
            <p className="mt-1 text-xs text-gray-500">The window is split into {event.slotDurationMins}-minute slots.</p>
            <Button type="submit" className="mt-3" loading={generateSlots.isPending}>
              Generate slots
            </Button>
          </form>
        </Form>
      )}

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-gray-700">Existing slots ({items.length})</p>
        {slots.isLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((slot) => (
              <span
                key={slot.id}
                className={`rounded border px-2 py-1 text-xs ${
                  slot.bookedCount >= slot.capacity
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-green-200 bg-green-50 text-green-700"
                }`}
              >
                {new Date(slot.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ({slot.bookedCount}/
                {slot.capacity})
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSlotsPanel;
