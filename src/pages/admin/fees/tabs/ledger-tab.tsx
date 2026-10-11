import { useState } from "react";
import toast from "react-hot-toast";

import ErrorState from "@/components/error-state";
import Pager from "@/components/pager";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { exportToCsv, formatMoney } from "@/utils";
import { fetchWholeLedger, LEDGER_PAGE_SIZE, useGetPaymentLedger } from "../service/fees-service";

const LedgerTab = ({ organizationId }: { organizationId: string }) => {
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const ledger = useGetPaymentLedger(organizationId, page);
  const payments = ledger.data?.items ?? [];
  const total = ledger.data?.total_count ?? 0;

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
          method: payment.method,
          date: new Date(payment.paidAt).toLocaleDateString(),
        }))
      );
    } catch {
      toast.error("The ledger could not be exported. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <CardTitle className="font-medium">Payment Ledger</CardTitle>
        <Button variant="secondary" size="sm" onClick={onExport} loading={isExporting} disabled={total === 0}>
          Export CSV
        </Button>
      </div>
      {ledger.isError ? (
        <ErrorState error={ledger.error} onRetry={() => ledger.refetch()} />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableHead>Receipt</TableHead>
              <TableHead className="text-center">Student</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Method</TableHead>
              <TableHead className="text-center">Date</TableHead>
            </TableHeader>
            <TableBody>
              {ledger.isLoading ? (
                <TableEmpty colSpan={6} message="Loading payments..." />
              ) : payments.length === 0 ? (
                <TableEmpty colSpan={6} message="No payments recorded yet." />
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.receiptNumber}</TableCell>
                    <TableCell className="text-center font-medium text-gray-900">
                      {typeof payment.studentId === "object" ? payment.studentId.name : ""}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge tone={payment.entryType === "reversal" ? "red" : "green"}>
                        {payment.entryType === "reversal" ? "Reversal" : "Payment"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{formatMoney(payment.amount)}</TableCell>
                    <TableCell className="text-center capitalize">{payment.method.replace("_", " ")}</TableCell>
                    <TableCell className="text-center">{new Date(payment.paidAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pager page={page} pageSize={LEDGER_PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      )}
    </Card>
  );
};

export default LedgerTab;
