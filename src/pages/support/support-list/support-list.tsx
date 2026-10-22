import EmptyState from "@/components/empty-state";
import ErrorState from "@/components/error-state";
import PageLoader from "@/components/page-loader";
import SectionHeader from "@/components/section-header";
import SupportDialog from "@/components/support-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS, TOPIC_OPTIONS } from "../support-labels";
import useSupportListController from "./support-list-controller";

const topicName = (topic: string) => TOPIC_OPTIONS.find((option) => option.id === topic)?.name ?? topic;

const SupportList = () => {
  const c = useSupportListController();

  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeader title="Help and support" description="Ask the Opscul team for help and follow their replies here." />
      <div className="mb-4 flex justify-end">
        <Button onClick={() => c.setIsAsking(true)}>Contact support</Button>
      </div>

      {c.isLoading ? (
        <PageLoader />
      ) : c.error ? (
        <ErrorState error={c.error} onRetry={c.retry} />
      ) : c.requests.length === 0 ? (
        <EmptyState title="No requests yet" description="If something isn't working or you have a question, contact support." />
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Request</TableHead>
            <TableHead>Topic</TableHead>
            {c.showsRequester && <TableHead>Asked by</TableHead>}
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Last activity</TableHead>
          </TableHeader>
          <TableBody>
            {c.requests.map((request) => (
              <TableRow key={request._id} className="cursor-pointer" onClick={() => c.open(request._id)}>
                <TableCell className="font-medium text-gray-900">
                  #{request.number} {request.subject}
                </TableCell>
                <TableCell>{topicName(request.topic)}</TableCell>
                {c.showsRequester && <TableCell>{request.requesterId?.name ?? request.requesterId?.email}</TableCell>}
                <TableCell className="text-center">
                  <Badge tone={STATUS[request.status].tone}>{STATUS[request.status].label}</Badge>
                </TableCell>
                <TableCell className="text-center">{new Date(request.lastMessageAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <SupportDialog open={c.isAsking} onClose={() => c.setIsAsking(false)} />
    </div>
  );
};

export default SupportList;
