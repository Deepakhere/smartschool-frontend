import ErrorState from "@/components/error-state";
import { SelectField, TextField } from "@/components/form-fields";
import NoRecordFound from "@/components/no-record-found";
import SectionHeader from "@/components/section-header";
import Spinner from "@/components/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/table";
import { SelectOption } from "@/types";
import useTeacherPTMController from "./ptm-controller";

const TeacherPTM = () => {
  const {
    t,
    form,
    events,
    agenda,
    eventSectionOptions,
    onEventChange,
    isLoadingAgenda,
    agendaError,
    retryAgenda,
    isGeneratingSlots,
    handleGenerateSlots,
  } = useTeacherPTMController();

  const eventOptions: SelectOption[] = events.map((event) => ({
    id: event.id,
    name: `${event.title} (${new Date(event.date).toLocaleDateString()})`,
  }));
  const sectionOptions: SelectOption[] = eventSectionOptions.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Parent-Teacher Meetings"
        description="Open your availability for parents to book, and track your agenda"
      />

      <Card className="mb-6">
        <CardTitle className="mb-4 font-medium">Open my availability</CardTitle>
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
      </Card>

      <Card>
        <CardTitle className="mb-4 font-medium">My agenda</CardTitle>
        {agendaError ? (
          <ErrorState error={agendaError} onRetry={retryAgenda} />
        ) : isLoadingAgenda ? (
          <Spinner />
        ) : agenda.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Time</TableHead>
              <TableHead className="text-center">Student</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableHeader>
            <TableBody>
              {agenda.map(({ slot, booking }) => (
                <TableRow key={slot.id}>
                  <TableCell className="font-medium text-gray-900">{new Date(slot.startAt).toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    {booking && typeof booking.studentId === "object" ? booking.studentId.name : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge tone={booking ? "green" : "gray"}>{booking ? "Booked" : "Open"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default TeacherPTM;
