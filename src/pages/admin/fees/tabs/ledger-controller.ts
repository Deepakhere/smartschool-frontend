import { useState } from "react";
import toast from "react-hot-toast";

import { useCan } from "@/context/tenant-context";
import { usePaging } from "@/hooks";
import { exportToCsv, paymentMethodLabel } from "@/utils";
import { fetchWholeLedger, useGetOnlinePaymentsForReview, useGetPaymentLedger } from "../service/fees-service";

const useLedgerController = (organizationId: string) => {
  const { page, pageSize, setPage, setPageSize } = usePaging();
  const [isExporting, setIsExporting] = useState(false);
  const ledger = useGetPaymentLedger(organizationId, page, pageSize);
  const toReview = useGetOnlinePaymentsForReview(useCan()("fees.collect") ? organizationId : "").data ?? [];
  const total = ledger.data?.pagination.totalItems ?? 0;

  // the export holds every payment, not just the page on screen
  const onExport = async () => {
    setIsExporting(true);
    try {
      const all = await fetchWholeLedger(organizationId);
      exportToCsv(
        "payment-ledger",
        all.map((payment) => ({
          receipt: payment.receiptNumber,
          student: typeof payment.studentId === "object" ? payment.studentId.name : "",
          type: payment.entryType === "reversal" ? "Reversal" : "Payment",
          amount: payment.amount / 100,
          method: paymentMethodLabel(payment.method),
          date: new Date(payment.paidAt).toLocaleDateString(),
        }))
      );
    } catch {
      toast.error("The ledger could not be exported. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    toReview,
    payments: ledger.data?.rows ?? [],
    isLoading: ledger.isLoading,
    error: ledger.isError ? ledger.error : null,
    retry: () => ledger.refetch(),
    pagination: { page, pageSize, total, onPageChange: setPage, onPageSizeChange: setPageSize },
    isExporting,
    onExport,
  };
};

export default useLedgerController;
