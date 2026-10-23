import DataTable, { DataTableColumn } from "@/components/data-table";
import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import { SelectField, TextField } from "@/components/form-fields";
import SectionHeader from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { IPTMBooking, IPTMSlot } from "@/types";
import useTeacherPTMController from "./ptm-controller";

type AgendaItem = { slot: IPTMSlot; booking: IPTMBooking | null };

const columns: DataTableColumn<AgendaItem>[] = [
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => <span className="font-medium text-gray-900">{new Date(row.original.slot.startAt).toLocaleString()}</span>,
  },
  {
    id: "student",
    header: "Student",
    meta: { align: "center" },
    cell: ({ row }) => {
      const { booking } = row.original;
      return booking && typeof booking.studentId === "object" ? booking.studentId.name : "-";
    },
  },
  {
    id: "status",
    header: "Status",
    meta: { align: "center" },
    cell: ({ row }) => <Badge tone={row.original.booking ? "green" : "gray"}>{row.original.booking ? "Booked" : "Open"}</Badge>,
  },
];

const TeacherPTM = () => {
  const {
    form,
    agenda,
    eventOptions,
    sectionOptions,
    onEventChange,
    isLoadingAgenda,
    agendaError,
    retryAgenda,
    isGeneratingSlots,
    handleGenerateSlots,
  } = useTeacherPTMController();

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Parent-Teacher Meetings"
        description="Open your availability for parents to book, and track your agenda"
      />

      <Card className="mb-6">
        <CardTitle className="mb-4 font-medium">Open my availability</CardTitle>
        {eventOptions.length === 0 ? (
          <EmptyState
            compact
            title="No meetings scheduled yet"
            description="When the school schedules a parent-teacher meeting for your classes, you can open your time here."
          />
        ) : (
          <Form {...form}>
          <form onSubmit={handleGenerateSlots} noValidate>
            <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-4">
              <SelectField form={form} name="eventId" label="PTM event" options={eventOptions} onValueChange={onEventChange} />
              <SelectField form={form} name="sectionId" label="Section" options={sectionOptions} />
              <TextField form={form} name="startAt" label="From" type="datetime-local" />
              <TextField form={form} name="endAt" label="To" type="datetime-local" />
            </div>
            <Button type="submit" className="mt-4" loading={isGeneratingSlots}>
              Generate slots
            </Button>
          </form>
          </Form>
        )}
      </Card>

      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-900">My agenda</h3>
        {agendaError ? (
          <ErrorState error={agendaError} onRetry={retryAgenda} />
        ) : (
          <DataTable
            columns={columns}
            data={agenda}
            getRowId={(item) => item.slot.id}
            isLoading={isLoadingAgenda}
            empty={{ title: "No meetings booked yet", description: "When parents book your slots, they show up here." }}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherPTM;
