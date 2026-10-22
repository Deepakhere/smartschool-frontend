import { useState } from "react";
import toast from "react-hot-toast";

import ErrorState from "@/components/error-state";
import Pager from "@/components/pager";
import { Table, TableBody, TableCell, TableEmpty, TableSkeletonRows, TableHead, TableHeader, TableRow } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { exportToCsv, formatMoney, paymentMethodLabel } from "@/utils";
import { useCan } from "@/context/tenant-context";
import { fetchWholeLedger, LEDGER_PAGE_SIZE, useGetOnlinePaymentsForReview, useGetPaymentLedger } from "../service/fees-service";

const LedgerTab = ({ organizationId }: { organizationId: string }) => {
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const ledger = useGetPaymentLedger(organizationId, page);
  const toReview = useGetOnlinePaymentsForReview(useCan()("fees.collect") ? organizationId : "").data ?? [];
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

  return (
    <div className="space-y-6">
      {toReview.length > 0 && (
        <Card className="border border-amber-200">
          <CardTitle className="font-medium">Online payments that need a look</CardTitle>
          <p className="mb-3 mt-1 text-sm text-gray-500">
            These were paid online but couldn&apos;t be applied, usually because the same fee was paid another way first. Record the amount on
            Student Fees &amp; Payments, or refund it from your Razorpay dashboard.
          </p>
          <Table>
            <TableHeader>
              <TableHead>Student</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Razorpay payment</TableHead>
              <TableHead className="text-center">Date</TableHead>
            </TableHeader>
            <TableBody>
              {toReview.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium text-gray-900">{item.studentId?.name ?? ""}</TableCell>
                  <TableCell className="text-center">{formatMoney(item.amount)}</TableCell>
                  <TableCell className="text-center font-mono text-xs">{item.gatewayPaymentId}</TableCell>
                  <TableCell className="text-center">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
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
                  <TableSkeletonRows columns={6} />
                ) : payments.length === 0 ? (
                  <TableEmpty colSpan={6} title="No payments recorded yet" description="Payments you record on Student Fees & Payments show up here, newest first." />
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
                      <TableCell className="text-center">{paymentMethodLabel(payment.method)}</TableCell>
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
    </div>
  );
};

export default LedgerTab;
