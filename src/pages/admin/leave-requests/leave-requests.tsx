import { useTranslation } from "react-i18next";

import Spinner from "@/components/spinner";
import EmptyState from "@/components/empty-state";
import SectionHeader from "@/components/section-header";
import CustomSelectDropdown from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeaveRequestsController } from "./leave-requests-controller";
import { SelectOption } from "@/types";

const STATUS_OPTIONS: SelectOption[] = [
  { id: "pending", name: "Pending" },
  { id: "approved", name: "Approved" },
  { id: "rejected", name: "Rejected" },
  { id: "cancelled", name: "Cancelled" },
];

const LeaveRequests = () => {
  const { t } = useTranslation();
  const c = useLeaveRequestsController();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader
        title="Leave Requests"
        description="Review and decide on student leave requests"
        actions={
          <div className="w-40">
            <CustomSelectDropdown
              options={STATUS_OPTIONS}
              value={STATUS_OPTIONS.find((o) => o.id === c.status) || null}
              onChange={(o) => c.setStatus(String(o.id))}
            />
          </div>
        }
      />

      <div className="bg-white shadow rounded-lg">
        {c.isLoading ? (
          <Spinner />
        ) : c.leaveRequests.length === 0 ? (
          <EmptyState title="No leave requests" description="Leave requests from parents will show up here." />
        ) : (
          <div className="divide-y divide-gray-100">
            {c.leaveRequests.map((lr) => (
              <div key={lr.id} className="px-4 py-4 space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {typeof lr.studentId === "object" ? lr.studentId.name : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      Requested by {typeof lr.requestedByUserId === "object" ? lr.requestedByUserId.name : ""}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(lr.fromDate).toLocaleDateString()} – {new Date(lr.toDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{lr.reason}</p>
                    {lr.attachmentURL && (
                      <a
                        href={lr.attachmentURL}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-primary-600 hover:underline"
                      >
                        {t("labels.attachment")}
                      </a>
                    )}
                  </div>
                </div>

                {lr.status === "pending" ? (
                  <div className="flex items-center gap-2 pt-1">
                    <Input
                      placeholder="Note (optional)"
                      value={c.notesByRequest[lr.id] || ""}
                      onChange={(e) => c.setNote(lr.id, e.target.value)}
                    />
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 focus-visible:ring-green-500"
                      disabled={c.isDeciding && c.decidingRequestId === lr.id}
                      onClick={() => c.handleDecide(lr.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-red-700 hover:bg-red-50"
                      disabled={c.isDeciding && c.decidingRequestId === lr.id}
                      onClick={() => c.handleDecide(lr.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 capitalize">
                    {lr.status}
                    {lr.decisionNote ? ` - ${lr.decisionNote}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
