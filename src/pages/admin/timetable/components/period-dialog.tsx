import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import FormDialog from "@/components/form-dialog";
import { ChipsField, SelectField, TextField } from "@/components/form-fields";
import { ISubject, ITeacherAssignment, SelectOption } from "@/types";
import { defaultPeriodValues, periodSchema, PeriodFormValues } from "../timetable.schema";
import { DAY_NAMES } from "../timetable.utils";
import { useCreateTimetableSlot } from "../service/timetable-service";

const dayOptions: SelectOption[] = [1, 2, 3, 4, 5, 6, 0].map((day) => ({ id: String(day), name: DAY_NAMES[day].slice(0, 3) }));

interface PeriodDialogProps {
  organizationId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  assignments: ITeacherAssignment[];
  subjects: ISubject[];
  open: boolean;
  onClose: () => void;
}

// one period, added to every chosen day at once; a clash on one day doesn't stop the others
const PeriodDialog = ({ organizationId, academicYearId, classId, sectionId, assignments, subjects, open, onClose }: PeriodDialogProps) => {
  const create = useCreateTimetableSlot(organizationId);
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<PeriodFormValues>({ resolver: zodResolver(periodSchema), defaultValues: defaultPeriodValues });

  useEffect(() => {
    if (open) form.reset(defaultPeriodValues);
  }, [open, form]);

  const teacherOptions: SelectOption[] = [...new Map(assignments.map((a) => [a.teacherUserId.id, a.teacherUserId.name])).entries()].map(
    ([id, name]) => ({ id, name })
  );
  const subjectOptions: SelectOption[] = subjects.map((subject) => ({ id: subject.id, name: subject.name }));

  // a subject teacher's own subject is the likely choice
  const pickTeacher = (teacherUserId: string) => {
    const subjectId = assignments.find((a) => a.teacherUserId.id === teacherUserId && a.subjectId)?.subjectId?.id;
    if (subjectId) form.setValue("subjectId", subjectId, { shouldValidate: true });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    const problems: string[] = [];
    for (const day of values.days) {
      try {
        await create.mutateAsync({
          academicYearId,
          classId,
          sectionId,
          subjectId: values.subjectId,
          teacherUserId: values.teacherUserId,
          dayOfWeek: Number(day),
          startTime: values.startTime,
          endTime: values.endTime,
          room: values.room || undefined,
        });
      } catch (error) {
        const message = (error as { response?: { Error?: { message?: string } } }).response?.Error?.message ?? "Could not be added.";
        problems.push(`${DAY_NAMES[Number(day)]}: ${message}`);
      }
    }
    setIsSaving(false);

    const added = values.days.length - problems.length;
    if (added) toast.success(`Added on ${added} day${added > 1 ? "s" : ""}.`);
    if (problems.length) {
      toast.error(problems.join("\n"), { duration: 8000 });
      form.setValue("days", values.days.filter((day) => problems.some((p) => p.startsWith(DAY_NAMES[Number(day)]))));
      return;
    }
    onClose();
  });

  return (
    <FormDialog
      form={form}
      open={open}
      onClose={onClose}
      title="Add period"
      description="Pick every day this period repeats on."
      submitLabel="Add"
      isSubmitting={isSaving}
      onSubmit={onSubmit}
      className="max-w-lg"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField form={form} name="teacherUserId" label="Teacher" options={teacherOptions} onValueChange={pickTeacher} />
        <SelectField form={form} name="subjectId" label="Subject" options={subjectOptions} />
      </div>
      <ChipsField form={form} name="days" label="Days" options={dayOptions} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField form={form} name="startTime" label="Starts" type="time" />
        <TextField form={form} name="endTime" label="Ends" type="time" />
        <TextField form={form} name="room" label="Room" placeholder="Optional" />
      </div>
      {teacherOptions.length === 0 && (
        <p className="text-sm text-amber-700">No teacher is assigned to this section yet. Assign one on the Classes page first.</p>
      )}
    </FormDialog>
  );
};

export default PeriodDialog;
