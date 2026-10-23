import { useCan } from "@/context/tenant-context";
import { useExportRows, usePaging } from "@/hooks";
import { downloadLedgerCsv, useGetOnlinePaymentsForReview, useGetPaymentLedger } from "../service/fees-service";

const useLedgerController = (organizationId: string) => {
  const { page, pageSize, setPage, setPageSize } = usePaging();
  const ledger = useGetPaymentLedger(organizationId, page, pageSize);
  const toReview = useGetOnlinePaymentsForReview(useCan()("fees.collect") ? organizationId : "").data ?? [];
  const total = ledger.data?.pagination.totalItems ?? 0;

  const { openExport, exportDialog } = useExportRows({
    total,
    itemLabel: { one: "payment", other: "payments" },
    download: (limit) => downloadLedgerCsv(organizationId, limit),
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
