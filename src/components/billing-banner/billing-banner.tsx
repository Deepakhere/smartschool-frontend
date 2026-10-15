import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { useTenant } from "@/context/tenant-context";
import { useAuth } from "@/context/auth-context";
import { useGetMyBillingSummary } from "./service";

const daysLeft = (dateString: string | null) => {
  if (!dateString) return null;
  return Math.ceil((new Date(dateString).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
};

// Shows the school's admin when the school is close to losing access. Parents and teachers can't act on
// payment, so they never see it; a platform admin isn't the affected party; and a school already locked
// out by tenant.js never reaches this far.
const BillingBanner = () => {
  const { organizationId, role } = useTenant();
  const { user } = useAuth();
  const summary = useGetMyBillingSummary(user?.isPlatformAdmin || role !== "admin" ? "" : organizationId);

  if (!summary.data) return null;
  const { billingStatus, trialEndsAt, graceEndsAt, studentLimit, activeStudentCount } = summary.data;

  let message: string | null = null;
  let tone: "warning" | "urgent" = "warning";

  if (billingStatus === "trialing") {
    const left = daysLeft(trialEndsAt);
    if (left !== null && left <= 7) {
      message =
        left > 0
          ? `Your free trial ends in ${left} day${left === 1 ? "" : "s"}. Contact us to arrange payment and keep access.`
          : "Your free trial has ended. Contact us to arrange payment and keep access.";
    }
  } else if (billingStatus === "grace") {
    const left = daysLeft(graceEndsAt);
    message =
      left !== null && left > 0
        ? `Your trial has ended. Please contact us to arrange payment within ${left} day${left === 1 ? "" : "s"} to avoid losing access.`
        : "Your trial has ended. Please contact us to arrange payment to avoid losing access.";
    tone = "urgent";
  } else if (billingStatus === "active" && studentLimit != null && activeStudentCount >= studentLimit * 0.9) {
    message = `You're close to your plan's student limit (${activeStudentCount} of ${studentLimit}). Contact us to upgrade.`;
  }

  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 text-sm ${
        tone === "urgent" ? "bg-red-50 text-red-800" : "bg-yellow-50 text-yellow-800"
      }`}
    >
      <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default BillingBanner;
