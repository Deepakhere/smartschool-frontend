import { useState } from "react";

import DatePicker from "@/components/date-picker";
import ErrorState from "@/components/error-state";
import Spinner from "@/components/spinner";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { exportToCsv, formatMoney } from "@/utils";
import { useGetFeeCollections } from "../service/fees-service";

const todayInIndia = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  cheque: "Cheque",
  bank_transfer: "Bank transfer",
  upi: "UPI",
  card: "Card",
  other: "Other",
};
const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00`));

const Tile = ({ label, value, tone = "text-gray-900" }: { label: string; value: string; tone?: string }) => (
  <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
    <p className={`mt-1 text-xl font-semibold ${tone}`}>{value}</p>
  </div>
);

const Breakdown = ({ title, columns, rows }: { title: string; columns: [string, string, string]; rows: [string, string, string][] }) => (
  <div>
    <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
    <Table>
      <TableHeader>
        <TableHead>{columns[0]}</TableHead>
        <TableHead className="text-center">{columns[1]}</TableHead>
        <TableHead className="text-center">{columns[2]}</TableHead>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableEmpty colSpan={3} title="Nothing collected" description="No payments in this date range." />
        ) : (
          rows.map(([a, b, c]) => (
            <TableRow key={a}>
              <TableCell className="font-medium text-gray-900">{a}</TableCell>
              <TableCell className="text-center">{b}</TableCell>
              <TableCell className="text-center">{c}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

// money received over a date range, and the same money by day, payment method and class
const CollectionsTab = ({ organizationId }: { organizationId: string }) => {
  const [from, setFrom] = useState(() => `${todayInIndia().slice(0, 7)}-01`);
  const [to, setTo] = useState(todayInIndia());
  const report = useGetFeeCollections(organizationId, from, to);
  const data = report.data;

  const onExport = () => {
    if (!data) return;
    exportToCsv(`fee-collections-${from}-to-${to}`, [
      ...data.byDay.map((d) => ({ breakdown: "Day", item: d.date, amount_rupees: d.amount / 100, entries: d.count })),
      ...data.byMethod.map((m) => ({ breakdown: "Method", item: METHOD_LABELS[m.method] ?? m.method, amount_rupees: m.amount / 100, entries: m.count })),
      ...data.byClass.map((c) => ({ breakdown: "Class", item: c.className, amount_rupees: c.amount / 100, entries: c.students })),
    ]);
  };

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <CardTitle className="font-medium">Fee Collections</CardTitle>
        <Button variant="secondary" size="sm" onClick={onExport} disabled={!data || data.totals.payments === 0}>
          Export to Excel
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <DatePicker label="From" value={from} max={to} onChange={setFrom} />
        <DatePicker label="To" value={to} min={from} max={todayInIndia()} onChange={setTo} />
      </div>

      {report.isError ? (
        <ErrorState error={report.error} onRetry={() => report.refetch()} />
      ) : !data ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Tile label="Received" value={formatMoney(data.totals.received)} />
            <Tile label="Reversed" value={formatMoney(data.totals.reversed)} tone={data.totals.reversed ? "text-red-700" : "text-gray-900"} />
            <Tile label="Net collected" value={formatMoney(data.totals.net)} tone="text-green-700" />
            <Tile label="Payments" value={String(data.totals.payments)} />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Breakdown
              title="By payment method"
              columns={["Method", "Amount", "Entries"]}
              rows={data.byMethod.map((m) => [METHOD_LABELS[m.method] ?? m.method, formatMoney(m.amount), String(m.count)])}
            />
            <Breakdown
              title="By class"
              columns={["Class", "Amount", "Students"]}
              rows={data.byClass.map((c) => [c.className, formatMoney(c.amount), String(c.students)])}
            />
            <div className="lg:col-span-2">
              <Breakdown
                title="By day"
                columns={["Day", "Amount", "Entries"]}
                rows={data.byDay.map((d) => [formatDay(d.date), formatMoney(d.amount), String(d.count)])}
              />
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default CollectionsTab;
