import { useCan } from "@/context/tenant-context";
import { useExportRows, usePaging } from "@/hooks";
import { IPayment } from "@/types";
import { paymentMethodLabel } from "@/utils";
import { fetchLedgerPage, useGetOnlinePaymentsForReview, useGetPaymentLedger } from "../service/fees-service";

const useLedgerController = (organizationId: string) => {
  const { page, pageSize, setPage, setPageSize } = usePaging();
  const ledger = useGetPaymentLedger(organizationId, page, pageSize);
  const toReview = useGetOnlinePaymentsForReview(useCan()("fees.collect") ? organizationId : "").data ?? [];
  const total = ledger.data?.pagination.totalItems ?? 0;

  const { openExport, exportDialog } = useExportRows<IPayment>({
    fileName: "payment-ledger",
    total,
    itemLabel: { one: "payment", other: "payments" },
    fetchPage: (page, limit) => fetchLedgerPage(organizationId, page, limit),
    toCsvRow: (payment) => ({
      receipt: payment.receiptNumber,
      student: typeof payment.studentId === "object" ? payment.studentId.name : "",
      type: payment.entryType === "reversal" ? "Reversal" : "Payment",
      amount: payment.amount / 100,
      method: paymentMethodLabel(payment.method),
      date: new Date(payment.paidAt).toLocaleDateString(),
    }),
  });

  return {
    toReview,
    payments: ledger.data?.rows ?? [],
    isLoading: ledger.isLoading,
    error: ledger.isError ? ledger.error : null,
    retry: () => ledger.refetch(),
    pagination: { page, pageSize, total, onPageChange: setPage, onPageSizeChange: setPageSize },
    openExport,
    exportDialog,
  };
};

export default useLedgerController;
