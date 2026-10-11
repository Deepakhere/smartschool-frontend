import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import FormDialog from "@/components/form-dialog";
import { ChipsField, DateField, SelectField, TextField } from "@/components/form-fields";
import { useError } from "@/hooks";
import { SelectOption } from "@/types";
import { localDateString } from "@/utils";
import { defaultPTMEventValues, ptmEventSchema, PTMEventFormValues } from "../ptm.schema";
import { useCreatePTMEvent } from "../service/ptm-service";

const modeOptions: SelectOption[] = [
  { id: "onsite", name: "Onsite" },
  { id: "online", name: "Online" },
];

interface CreateEventDialogProps {
  organizationId: string;
  academicYearId?: string;
  sectionOptions: SelectOption[];
  open: boolean;
  onClose: () => void;
}

const CreateEventDialog = ({ organizationId, academicYearId, sectionOptions, open, onClose }: CreateEventDialogProps) => {
  const createEvent = useCreatePTMEvent(organizationId);
  useError({ mutation: createEvent });

  const form = useForm<PTMEventFormValues>({ resolver: zodResolver(ptmEventSchema), defaultValues: defaultPTMEventValues });
  const mode = useWatch({ control: form.control, name: "mode" });

  useEffect(() => {
    if (open) form.reset(defaultPTMEventValues);
  }, [open, form]);

  const onSubmit = form.handleSubmit((values) => {
    if (!academicYearId) {
      toast.error("Set a current academic year first (Academics page).");
      return;
    }
    createEvent.mutate(
      {
        academicYearId,
        title: values.title,
        date: values.date,
        mode: values.mode,
        venue: values.mode === "onsite" ? values.venue || undefined : undefined,
        defaultMeetingLink: values.mode === "online" ? values.defaultMeetingLink : undefined,
        slotDurationMins: Number(values.slotDurationMins),
        sectionIds: values.sectionIds,
      },
      {
        onSuccess: () => {
          toast.success("PTM event created.");
          onClose();
        },
      }
    );
  });

  return (
    <FormDialog
      form={form}
      open={open}
      onClose={onClose}
      title="New PTM Event"
      description="Parents of the chosen sections can book once teachers open their slots."
      submitLabel="Create"
      isSubmitting={createEvent.isPending}
      onSubmit={onSubmit}
      className="max-w-2xl"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField form={form} name="title" label="Title" placeholder="Term 1 PTM" autoFocus />
        <DateField form={form} name="date" label="Date" min={localDateString()} />
        <SelectField form={form} name="mode" label="Mode" options={modeOptions} />
        <TextField form={form} name="slotDurationMins" label="Slot duration (mins)" type="number" min={5} max={120} />
        {mode === "onsite" ? (
          <TextField form={form} name="venue" label="Venue" placeholder="School auditorium" className="sm:col-span-2" />
        ) : (
          <TextField
            form={form}
            name="defaultMeetingLink"
            label="Meeting link"
            placeholder="https://meet.google.com/..."
            className="sm:col-span-2"
          />
        )}
      </div>
      <ChipsField form={form} name="sectionIds" label="Sections" options={sectionOptions} emptyText="No sections found." />
    </FormDialog>
  );
};

export default CreateEventDialog;
