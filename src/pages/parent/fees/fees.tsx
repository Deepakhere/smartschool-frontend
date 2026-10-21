import { IAPIError } from "@/types";
import ErrorState from "@/components/error-state";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PageLoader from "@/components/page-loader";
import EmptyState from "@/components/empty-state";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/table";
import SectionHeader from "@/components/section-header";
import { downloadFeeReceipt, useEmailFeeReceipt } from "@/pages/admin/fees/service/fees-service";
import useParentFeesController from "./fees-controller";

import { formatMoney, paymentMethodLabel } from "@/utils";
import { Button } from "@/components/ui/button";

const ParentFees = () => {
  const { fees, isLoading, loadError, retryLoad, canPayOnline, payOnline, paying } = useParentFeesController();
  const isPaying = (studentFeeId: string, label?: string) =>
    paying?.studentFeeId === studentFeeId && (label ? paying.installmentLabels?.[0] === label : !paying.installmentLabels);
  const { organizationId } = useParams();
  const emailFeeReceipt = useEmailFeeReceipt(organizationId || "");

  const handleDownload = async (paymentId: string) => {
    try {
      await downloadFeeReceipt(organizationId || "", paymentId);
    } catch (error) {
      toast.error((error as IAPIError)?.response?.Error?.message || "Could not download the receipt. Please try again.");
    }
  };

  const handleEmail = (paymentId: string) => {
    emailFeeReceipt.mutate(paymentId, {
      onSuccess: () => toast.success("Receipt emailed to your registered email address."),
      // for example "No registered email address found" says what to fix
        onError: (error) => toast.error(error?.response?.Error?.message || "Could not email the receipt. Please try again."),
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Fees" description="View dues, installments and payment history for your children" />
      {loadError ? (
        <ErrorState error={loadError} onRetry={retryLoad} />
      ) : isLoading ? (
        <PageLoader />
      ) : fees.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <EmptyState title="No fees yet" description="Fees the school assigns to your children will show up here." />
        </div>
      ) : (
        <div className="space-y-6">
          {fees.map((fee) => (
            <div key={fee.studentFeeId} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{fee.studentName}</h2>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      fee.totalBalance > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {fee.totalBalance > 0 ? `Due: ${formatMoney(fee.totalBalance)}` : "Fully paid"}
                  </span>
                  {canPayOnline && fee.totalBalance > 0 && (
                    <Button size="sm" loading={isPaying(fee.studentFeeId)} disabled={!!paying} onClick={() => payOnline(fee.studentFeeId)}>
                      Pay {formatMoney(fee.totalBalance)} now
                    </Button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Table>
                  <TableHeader>
                    <TableHead>Installment</TableHead>
                    <TableHead className="text-center">Due date</TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-center">Paid</TableHead>
                    <TableHead className="text-center">Balance</TableHead>
                  </TableHeader>
                  <TableBody>
                    {fee.installments.map((i) => (
                      <TableRow key={i.label}>
                        <TableCell className="font-medium text-gray-900">{i.label}</TableCell>
                        <TableCell className="text-center">{new Date(i.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">{formatMoney(i.netAmount)}</TableCell>
                        <TableCell className="text-center">{formatMoney(i.paidAmount)}</TableCell>
                        <TableCell className={`text-center ${i.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                          {formatMoney(i.balance)}
                          {canPayOnline && i.balance > 0 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="ml-2"
                              loading={isPaying(fee.studentFeeId, i.label)}
                              disabled={!!paying}
                              onClick={() => payOnline(fee.studentFeeId, [i.label])}
                            >
                              Pay
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {fee.payments.filter((p) => p.entryType === "payment").length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Payment history</p>
                  <Table>
                    <TableHeader>
                      <TableHead>Receipt</TableHead>
                      <TableHead className="text-center">Amount</TableHead>
                      <TableHead className="text-center">Method</TableHead>
                      <TableHead className="text-center">Date</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableHeader>
                    <TableBody>
                      {fee.payments
                        .filter((p) => p.entryType === "payment")
                        .map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium text-gray-900">{p.receiptNumber}</TableCell>
                            <TableCell className="text-center">{formatMoney(p.amount)}</TableCell>
                            <TableCell className="text-center">{paymentMethodLabel(p.method)}</TableCell>
                            <TableCell className="text-center">{new Date(p.paidAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex gap-3 justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleDownload(p.id)}
                                  className="text-xs text-primary-600 hover:text-primary-800"
                                >
                                  Download
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEmail(p.id)}
                                  disabled={emailFeeReceipt.isPending}
                                  className="text-xs text-primary-600 hover:text-primary-800 disabled:opacity-50"
                                >
                                  Email me
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentFees;
