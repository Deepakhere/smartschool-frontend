import { useTranslation } from "react-i18next";

import Spinner from "@/components/spinner";
import NoRecordFound from "@/components/no-record-found";
import SectionHeader from "@/components/section-header";
import CustomSelectDropdown from "@/components/custom-select";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLeaveRequestsController } from "./leave-requests-controller";
import { SelectOption } from "@/types";

const btnPrimary =
  "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50";
const btnSecondary =
  "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50";

const statusBadgeClass: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const LeaveRequests = () => {
  const { t } = useTranslation();
  const c = useLeaveRequestsController();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader
        title="Leave Requests"
        description="Request leave for your child and track its status"
        actions={
          <button className={btnPrimary} onClick={() => c.setShowForm(!c.showForm)}>
            + New Leave Request
          </button>
        }
      />

      {c.showForm && (
        <Form {...c.form}>
          <form onSubmit={c.onSubmit} className="bg-white shadow rounded-lg p-4 space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={c.form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Child</FormLabel>
                    <FormControl>
                      <CustomSelectDropdown
                        placeholder="Select child"
                        options={c.children.map((child): SelectOption => ({
                          id: child.studentId.id,
                          name: child.studentId.name,
                        }))}
                        value={(() => {
                          const child = c.children.find((child) => child.studentId.id === field.value);
                          return child ? { id: child.studentId.id, name: child.studentId.name } : null;
                        })()}
                        onChange={(o) => field.onChange(String(o.id))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={c.form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={c.form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={c.form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">{t("labels.attachment")}</label>
              <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={c.handleFileChange} />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" className={btnSecondary} onClick={() => c.setShowForm(false)}>
                {t("buttons.cancel")}
              </button>
              <button type="submit" disabled={c.isCreating} className={btnPrimary}>
                {t("buttons.save")}
              </button>
            </div>
          </form>
        </Form>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Requests</h2>
        </div>
        {c.isLoading ? (
          <Spinner />
        ) : c.leaveRequests.length === 0 ? (
          <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
        ) : (
          <div className="divide-y divide-gray-100">
            {c.leaveRequests.map((lr) => (
              <div key={lr.id} className="px-4 py-4 flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {typeof lr.studentId === "object" ? lr.studentId.name : ""}{" "}
                    <span
                      className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full capitalize ${statusBadgeClass[lr.status]}`}
                    >
                      {lr.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(lr.fromDate).toLocaleDateString()} – {new Date(lr.toDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{lr.reason}</p>
                  {lr.decisionNote && <p className="text-xs text-gray-500 mt-1">Note from school: {lr.decisionNote}</p>}
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
                {lr.status === "pending" && (
                  <button
                    onClick={() => c.handleCancel(lr.id)}
                    className="text-sm text-red-600 hover:text-red-800 shrink-0"
                  >
                    {t("buttons.cancel")}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        open={!!c.leaveRequestIdPendingCancel}
        title="Cancel Leave Request"
        description="Are you sure you want to cancel this leave request?"
        isLoading={c.isCancelling}
        confirmLabel="Cancel Request"
        cancelLabel="Keep It"
        onClose={c.cancelDialogClose}
        onConfirm={c.confirmCancel}
      />
    </div>
  );
};

export default LeaveRequests;
