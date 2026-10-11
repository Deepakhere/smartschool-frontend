import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { SelectField, TextField } from "@/components/form-fields";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useError } from "@/hooks";
import { IStudentFeeSummary, SelectOption } from "@/types";
import { formatMoney, toPaise } from "@/utils";
import {
  concessionSchema,
  ConcessionFormValues,
  defaultConcessionValues,
  defaultPaymentValues,
  paymentSchema,
  PaymentFormValues,
} from "../fees.schema";
import { useGrantConcession, useRecordPayment } from "../service/fees-service";

const methodOptions: SelectOption[] = [
  { id: "cash", name: "Cash" },
  { id: "cheque", name: "Cheque" },
  { id: "bank_transfer", name: "Bank transfer" },
  { id: "upi", name: "UPI" },
  { id: "card", name: "Card" },
];

// a select option cannot have an empty value
const ANY_INSTALLMENT = "any";

interface StudentFeeCardProps {
  organizationId: string;
  summary: IStudentFeeSummary;
  onReverse: (paymentId: string) => void;
}

// one assigned fee record: balances, the payment and concession forms, and its history
const StudentFeeCard = ({ organizationId, summary, onReverse }: StudentFeeCardProps) => {
  const recordPayment = useRecordPayment(organizationId);
  const grantConcession = useGrantConcession(organizationId);
  useError({ mutation: recordPayment });
  useError({ mutation: grantConcession });

  const paymentForm = useForm<PaymentFormValues>({ resolver: zodResolver(paymentSchema), defaultValues: defaultPaymentValues });
  const concessionDefaults = { ...defaultConcessionValues, installmentLabel: ANY_INSTALLMENT };
  const concessionForm = useForm<ConcessionFormValues>({
    resolver: zodResolver(concessionSchema),
    defaultValues: concessionDefaults,
  });

  const onRecordPayment = paymentForm.handleSubmit((values) =>
    recordPayment.mutate(
      {
        studentFeeId: summary.studentFeeId,
        amount: toPaise(values.amount),
        method: values.method,
        instrumentRef: values.instrumentRef || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Payment recorded.");
          paymentForm.reset(defaultPaymentValues);
        },
      }
    )
  );

  const onGrantConcession = concessionForm.handleSubmit((values) =>
    grantConcession.mutate(
      {
        studentFeeId: summary.studentFeeId,
        amount: toPaise(values.amount),
        reason: values.reason,
        installmentLabel: values.installmentLabel === ANY_INSTALLMENT ? undefined : values.installmentLabel,
      },
      {
        onSuccess: () => {
          toast.success("Concession granted.");
          concessionForm.reset(concessionDefaults);
        },
      }
    )
  );

  const installmentOptions: SelectOption[] = [
    { id: ANY_INSTALLMENT, name: "Any installment (oldest first)" },
    ...summary.installments.map((row) => ({ id: row.label, name: row.label })),
  ];
  const reversedIds = new Set(summary.payments.map((payment) => payment.reversalOfPaymentId).filter(Boolean));

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-900">
          Balance: {formatMoney(summary.totalBalance)} of {formatMoney(summary.totalNet)}
        </h3>
        <Badge tone={summary.totalBalance > 0 ? "red" : "green"}>{summary.totalBalance > 0 ? "Due" : "Fully paid"}</Badge>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Installment</TableHead>
          <TableHead className="text-center">Due</TableHead>
          <TableHead className="text-center">Net</TableHead>
          <TableHead className="text-center">Paid</TableHead>
          <TableHead className="text-center">Balance</TableHead>
        </TableHeader>
        <TableBody>
          {summary.installments.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium text-gray-900">{row.label}</TableCell>
              <TableCell className="text-center">{new Date(row.dueDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-center">{formatMoney(row.netAmount)}</TableCell>
              <TableCell className="text-center">{formatMoney(row.paidAmount)}</TableCell>
              <TableCell className={`text-center ${row.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                {formatMoney(row.balance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 rounded-md bg-gray-50 p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">Record a payment</p>
        <Form {...paymentForm}>
          <form onSubmit={onRecordPayment} noValidate className="grid grid-cols-1 items-start gap-3 sm:grid-cols-4">
            <TextField form={paymentForm} name="amount" label="Amount (₹)" type="number" min={0} step="0.01" />
            <SelectField form={paymentForm} name="method" label="Method" options={methodOptions} />
            <TextField form={paymentForm} name="instrumentRef" label="Reference" placeholder="Cheque no. / UTR" />
            <Button type="submit" className="sm:mt-6" loading={recordPayment.isPending}>
              Record
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-4 rounded-md bg-gray-50 p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">Grant a concession</p>
        <Form {...concessionForm}>
          <form onSubmit={onGrantConcession} noValidate className="grid grid-cols-1 items-start gap-3 sm:grid-cols-4">
            <TextField form={concessionForm} name="amount" label="Amount (₹)" type="number" min={0} step="0.01" />
            <TextField form={concessionForm} name="reason" label="Reason" />
            <SelectField form={concessionForm} name="installmentLabel" label="Apply to" options={installmentOptions} />
            <Button type="submit" className="sm:mt-6" loading={grantConcession.isPending}>
              Grant
            </Button>
          </form>
        </Form>
      </div>

      {!!summary.concessions?.length && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Concessions granted</p>
          <Table>
            <TableHeader>
              <TableHead>Reason</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Date</TableHead>
            </TableHeader>
            <TableBody>
              {summary.concessions.map((concession) => (
                <TableRow key={concession.id}>
                  <TableCell>{concession.reason}</TableCell>
                  <TableCell className="text-center">{formatMoney(concession.amount)}</TableCell>
                  <TableCell className="text-center">{new Date(concession.approvedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {summary.payments.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Payment history</p>
          <Table>
            <TableHeader>
              <TableHead>Receipt</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Method</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableHeader>
            <TableBody>
              {summary.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.receiptNumber}</TableCell>
                  <TableCell className="text-center">
                    <Badge tone={payment.entryType === "reversal" ? "red" : "green"}>
                      {payment.entryType === "reversal" ? "Reversal" : "Payment"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{formatMoney(payment.amount)}</TableCell>
                  <TableCell className="text-center capitalize">{payment.method.replace("_", " ")}</TableCell>
                  <TableCell className="text-center">
                    {payment.entryType === "payment" && !reversedIds.has(payment.id) && (
                      <Button variant="link" className="text-red-600 hover:text-red-800" onClick={() => onReverse(payment.id)}>
                        Reverse
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default StudentFeeCard;
