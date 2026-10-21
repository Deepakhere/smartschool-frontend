import PageLoader from "@/components/page-loader";
import EmptyState from "@/components/empty-state";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/table";
import { Switch } from "@/components/ui/switch";
import useNotificationsController from "./notifications-controller";

const statusColors: Record<string, string> = {
  // waiting in the email queue, or being retried after a failed attempt
  queued: "bg-amber-100 text-amber-800",
  sent: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  skipped: "bg-gray-100 text-gray-600",
};

const Notifications = () => {
  const { t, emailNotificationsEnabled, feeRemindersEnabled, emailLog, isLoading, isUpdating, toggleEmailNotifications, toggleFeeReminders } =
    useNotificationsController();

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{t("labels.email_notifications")}</p>
            <p className="text-sm text-gray-500 mt-1">
              Turn off to stop every email Opscul sends for this school - fee receipts, notices, homework,
              attendance, results and leave-request updates. A parent or staff member can still turn their own
              email notifications off separately regardless of this setting.
            </p>
          </div>
          <Switch checked={emailNotificationsEnabled} disabled={isUpdating} onCheckedChange={toggleEmailNotifications} />
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
          <div>
            <p className="text-sm font-medium text-gray-900">Fee due reminders</p>
            <p className="text-sm text-gray-500 mt-1">
              Remind parents in the app three days before an instalment is due, then once a week while it stays unpaid.
              Reminders are emailed too while email notifications are on.
            </p>
          </div>
          <Switch checked={feeRemindersEnabled} disabled={isUpdating} onCheckedChange={toggleFeeReminders} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm font-medium text-gray-900 mb-4">Recent email activity</p>
        {isLoading ? (
          <PageLoader />
        ) : emailLog.length === 0 ? (
          <EmptyState title="No emails sent yet" description="Every email the school sends will be listed here." />
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Recipient</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Date</TableHead>
            </TableHeader>
            <TableBody>
              {emailLog.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium text-gray-900">{log.recipientEmail}</TableCell>
                  <TableCell className="text-gray-600">
                    {log.subject}
                    {log.reason && <span className="block text-xs text-gray-400">{log.reason}</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[log.status]}`}>
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Notifications;
