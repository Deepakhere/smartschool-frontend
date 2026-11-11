import { DataTableColumn } from "@/shared/ui/data-table";
import { IFeeInstallmentBalance, IPayment } from "@/entities/fee";
import { formatMoney, paymentMethodLabel } from "@/shared/lib";
import { BalanceCell, ReceiptActions } from "./components/fee-cells";

export interface InstallmentColumnActions {
  compact?: boolean;
  canPayOnline: boolean;
  isBusy: boolean;
  isPaying: (label: string) => boolean;
  pay: (label: string) => void;
}

const dateLabel = (value: string) => new Date(value).toLocaleDateString();

// below the desktop width each table keeps to two columns so Pay and the receipt links never sit off screen
export const installmentColumns = (actions: InstallmentColumnActions): DataTableColumn<IFeeInstallmentBalance>[] =>
  actions.compact
    ? [
        {
          id: "label",
          header: "Installment",
          cell: ({ row: { original: item } }) => (
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500">Due {dateLabel(item.dueDate)}</p>
              <p className="text-xs text-gray-500">Total {formatMoney(item.netAmount)}</p>
              <p className="text-xs text-gray-500">Paid {formatMoney(item.paidAmount)}</p>
            </div>
          ),
        },
        {
          id: "balance",
          header: "Balance",
          meta: { align: "right" },
          cell: ({ row }) => <BalanceCell item={row.original} actions={actions} />,
        },
      ]
    : [
        {
          id: "label",
          header: "Installment",
          cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.label}</span>,
        },
        {
          id: "dueDate",
          header: "Due date",
          meta: { align: "center" },
          cell: ({ row }) => dateLabel(row.original.dueDate),
        },
        {
          id: "amount",
          header: "Amount",
          meta: { align: "center" },
          cell: ({ row }) => formatMoney(row.original.netAmount),
        },
        {
          id: "paid",
          header: "Paid",
          meta: { align: "center" },
          cell: ({ row }) => formatMoney(row.original.paidAmount),
        },
        {
          id: "balance",
          header: "Balance",
          meta: { align: "center" },
          cell: ({ row }) => <BalanceCell item={row.original} actions={actions} />,
        },
      ];

export interface PaymentColumnActions {
  compact?: boolean;
  isEmailing: boolean;
  download: (paymentId: string) => void;
  email: (paymentId: string) => void;
}

export const paymentColumns = (actions: PaymentColumnActions): DataTableColumn<IPayment>[] =>
  actions.compact
    ? [
        {
          id: "receipt",
          header: "Receipt",
          cell: ({ row: { original: payment } }) => (
            <div className="space-y-1">
              <p className="font-medium text-gray-900">{payment.receiptNumber}</p>
              <p className="text-xs text-gray-500">
                {dateLabel(payment.paidAt)}, {paymentMethodLabel(payment.method)}
              </p>
              <ReceiptActions payment={payment} {...actions} />
            </div>
          ),
        },
        {
          id: "amount",
          header: "Amount",
          meta: { align: "right" },
          cell: ({ row }) => formatMoney(row.original.amount),
        },
      ]
    : [
        {
          id: "receipt",
          header: "Receipt",
          cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.receiptNumber}</span>,
        },
        {
          id: "amount",
          header: "Amount",
          meta: { align: "center" },
          cell: ({ row }) => formatMoney(row.original.amount),
        },
        {
          id: "method",
          header: "Method",
          meta: { align: "center" },
          cell: ({ row }) => paymentMethodLabel(row.original.method),
        },
        { id: "date", header: "Date", meta: { align: "center" }, cell: ({ row }) => dateLabel(row.original.paidAt) },
        {
          id: "actions",
          header: "Actions",
          meta: { align: "center" },
          cell: ({ row }) => (
            <div className="flex justify-center">
              <ReceiptActions payment={row.original} {...actions} />
            </div>
          ),
        },
      ];
