import { DataTableColumn } from "@/shared/ui/data-table";
import { Badge } from "@/shared/ui/kit/badge";
import RowMenu from "@/shared/ui/row-menu";
import { IFeeConcession, IFeeInstallmentBalance, IPayment } from "@/entities/fee";
import { formatMoney, paymentMethodLabel } from "@/shared/lib";

export const installmentColumns: DataTableColumn<IFeeInstallmentBalance>[] = [
  {
    id: "label",
    header: "Installment",
    cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.label}</span>,
  },
  {
    id: "dueDate",
    header: "Due",
    meta: { align: "center" },
    cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString(),
  },
  {
    id: "net",
    header: "Net",
    meta: { align: "center" },
    cell: ({ row }) => (
      <>
        {formatMoney(row.original.netAmount)}
        {!!row.original.lateFeeAmount && (
          <p className="text-xs text-red-600">incl. late fee {formatMoney(row.original.lateFeeAmount)}</p>
        )}
      </>
    ),
  },
  { id: "paid", header: "Paid", meta: { align: "center" }, cell: ({ row }) => formatMoney(row.original.paidAmount) },
  {
    id: "balance",
    header: "Balance",
    meta: { align: "center" },
    cell: ({ row }) => (
      <span className={row.original.balance > 0 ? "text-red-600" : "text-green-600"}>
        {formatMoney(row.original.balance)}
      </span>
    ),
  },
];

export const concessionColumns: DataTableColumn<IFeeConcession>[] = [
  { id: "reason", header: "Reason", cell: ({ row }) => row.original.reason },
  { id: "amount", header: "Amount", meta: { align: "center" }, cell: ({ row }) => formatMoney(row.original.amount) },
  {
    id: "date",
    header: "Date",
    meta: { align: "center" },
    cell: ({ row }) => new Date(row.original.approvedAt).toLocaleDateString(),
  },
];

interface PaymentColumnActions {
  canReverse: (paymentId: string) => boolean;
  reverse: (paymentId: string) => void;
  download: (paymentId: string) => void;
  downloadingId?: string;
}

export const paymentColumns = ({
  canReverse,
  reverse,
  download,
  downloadingId,
}: PaymentColumnActions): DataTableColumn<IPayment>[] => [
  { id: "receipt", header: "Receipt", cell: ({ row }) => row.original.receiptNumber },
  {
    id: "type",
    header: "Type",
    meta: { align: "center" },
    cell: ({ row }) => (
      <Badge tone={row.original.entryType === "reversal" ? "red" : "green"}>
        {row.original.entryType === "reversal" ? "Reversal" : "Payment"}
      </Badge>
    ),
  },
  { id: "amount", header: "Amount", meta: { align: "center" }, cell: ({ row }) => formatMoney(row.original.amount) },
  {
    id: "method",
    header: "Method",
    meta: { align: "center" },
    cell: ({ row }) => paymentMethodLabel(row.original.method),
  },
  {
    id: "actions",
    header: "Action",
    meta: { align: "center" },
    cell: ({ row }) => (
      <RowMenu
        items={[
          {
            label: downloadingId === row.original.id ? "Downloading..." : "Download receipt",
            readOnlySafe: true,
            onSelect: () => download(row.original.id),
          },
          ...(row.original.entryType === "payment" && canReverse(row.original.id)
            ? [{ label: "Reverse payment", danger: true, onSelect: () => reverse(row.original.id) }]
            : []),
        ]}
      />
    ),
  },
];
