import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import FormDialog from "@/components/form-dialog";
import { DateField, SelectField, TextField } from "@/components/form-fields";
import { useError } from "@/hooks";
import { ICalendarEntry, SelectOption } from "@/types";
import { calendarEntrySchema, CalendarEntryFormValues, defaultCalendarEntryValues } from "../calendar.schema";
import { WEEKDAYS, weekdayOf } from "../calendar.utils";
import { useSaveCalendarEntry } from "../service/calendar-service";

const typeOptions: SelectOption[] = [
  { id: "holiday", name: "Day off / Holiday" },
  { id: "half_day", name: "Half day" },
  { id: "event", name: "Full day event" },
];

interface EntryDialogProps {
  organizationId: string;
  entry: ICalendarEntry | null;
  defaultDate: string;
  open: boolean;
  onClose: () => void;
}

const EntryDialog = ({ organizationId, entry, defaultDate, open, onClose }: EntryDialogProps) => {
  const save = useSaveCalendarEntry(organizationId);
  useError({ mutation: save });

  const form = useForm<CalendarEntryFormValues>({ resolver: zodResolver(calendarEntrySchema), defaultValues: defaultCalendarEntryValues });
  const date = useWatch({ control: form.control, name: "date" });

  useEffect(() => {
    if (!open) return;
    form.reset(
      entry
        ? { title: entry.title, type: entry.type, date: entry.startDate, repeat: entry.recurring ? "weekly" : "none" }
        : { ...defaultCalendarEntryValues, date: defaultDate }
    );
  }, [open, entry, defaultDate, form]);

  const repeatOptions: SelectOption[] = [
    { id: "none", name: "Does not repeat" },
    { id: "weekly", name: date ? `Every ${WEEKDAYS[weekdayOf(date)]}` : "Every week" },
  ];

  const onSubmit = form.handleSubmit((values) => {
    save.mutate(
      {
        id: entry?.id,
        title: values.title,
        type: values.type,
        date: values.date,
        recurrence: values.repeat === "weekly" ? { frequency: "weekly", dayOfWeek: weekdayOf(values.date) } : null,
      },
      {
        onSuccess: () => {
          toast.success(entry ? "Entry updated." : "Entry added.");
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
      title={entry ? "Edit entry" : "Add event"}
      description="Holidays are treated as non-school days in attendance."
      submitLabel={entry ? "Save" : "Add"}
      isSubmitting={save.isPending}
      onSubmit={onSubmit}
      className="max-w-lg"
    >
      <TextField form={form} name="title" label="Title" placeholder="Ram Navmi" autoFocus />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField form={form} name="type" label="Type" options={typeOptions} />
        <DateField form={form} name="date" label={entry?.recurring ? "Starts on" : "Date"} />
      </div>
      <SelectField form={form} name="repeat" label="Repeat" options={repeatOptions} />
    </FormDialog>
  );
};

export default EntryDialog;
