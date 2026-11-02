import { useCan } from "@/entities/session";
import { useState } from "react";

import { useDebouncedValue, useError, useExportRows, usePaging } from "@/shared/lib/hooks";
import {
  downloadLedgerCsv,
  useDownloadFeeReceipt,
  useGetOnlinePaymentsForReview,
  useGetPaymentLedger,
} from "@/entities/fee";

const useLedgerController = (organizationId: string) => {
  const { page, pageSize, setPage, setPageSize, resetPage } = usePaging();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim());
  const ledger = useGetPaymentLedger(organizationId, page, pageSize, debouncedSearch);
  const toReview = useGetOnlinePaymentsForReview(useCan()("fees.collect") ? organizationId : "").data ?? [];
  const total = ledger.data?.pagination.totalItems ?? 0;
  const downloadReceipt = useDownloadFeeReceipt(organizationId);
  useError({ mutation: downloadReceipt });

  const { openExport, exportDialog } = useExportRows({
    total,
    itemLabel: { one: "payment", other: "payments" },
    // the export follows the search on screen
    download: (limit) => downloadLedgerCsv(organizationId, limit, debouncedSearch),
  });

  return {
    toReview,
    payments: ledger.data?.rows ?? [],
    isLoading: ledger.isLoading,
    isSearching: !!debouncedSearch,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      resetPage();
    },
    error: ledger.isError ? ledger.error : null,
    retry: () => ledger.refetch(),
    pagination: { page, pageSize, total, onPageChange: setPage, onPageSizeChange: setPageSize },
    openExport,
    exportDialog,
    downloadReceipt: (paymentId: string) => downloadReceipt.mutate(paymentId),
    downloadingId: downloadReceipt.isPending ? downloadReceipt.variables : undefined,
  };
};

export default useLedgerController;
