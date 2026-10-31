import ActionButtons from "@/shared/ui/action-buttons";
import DataTable, { DataTableColumn } from "@/shared/ui/data-table";
import DatePicker from "@/shared/ui/date-picker";
import ErrorState from "@/shared/ui/error-state";
import Spinner from "@/shared/ui/spinner";
import { formatMoney, paymentMethodLabel, todayInIndia } from "@/shared/lib";
import useCollectionsController from "./collections-controller";

type BreakdownRow = [string, string, string];

const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(
    new Date(`${iso}T00:00:00`)
  );

const Tile = ({ label, value, tone = "text-gray-900" }: { label: string; value: string; tone?: string }) => (
  <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
    <p className={`mt-1 text-xl font-semibold ${tone}`}>{value}</p>
  </div>
);

const breakdownColumns = (names: BreakdownRow): DataTableColumn<BreakdownRow>[] => [
  {
    id: "item",
    header: names[0],
    cell: ({ row }) => <span className="font-medium text-gray-900">{row.original[0]}</span>,
  },
  { id: "amount", header: names[1], meta: { align: "center" }, cell: ({ row }) => row.original[1] },
  { id: "count", header: names[2], meta: { align: "center" }, cell: ({ row }) => row.original[2] },
];

const Breakdown = ({ title, columns, rows }: { title: string; columns: BreakdownRow; rows: BreakdownRow[] }) => (
  <div>
    <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
    <DataTable
      columns={breakdownColumns(columns)}
      data={rows}
      getRowId={(row) => row[0]}
      empty={{ title: "Nothing collected", description: "No payments in this date range." }}
    />
  </div>
);

// money received over a date range, and the same money by day, payment method and class
const CollectionsTab = ({ organizationId }: { organizationId: string }) => {
  const c = useCollectionsController(organizationId);
  const data = c.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">From</span>
          <DatePicker clearable={false} value={c.from} max={c.to} onChange={c.setFrom} className="w-40" />
          <span className="text-sm text-gray-500">to</span>
          <DatePicker
            clearable={false}
            value={c.to}
            min={c.from}
            max={todayInIndia()}
            onChange={c.setTo}
            className="w-40"
          />
        </div>
        <ActionButtons
          actions={[
            {
              label: "Export CSV",
              readOnlySafe: true,
              onClick: c.onExport,
              disabled: !data || data.totals.payments === 0,
            },
          ]}
        />
      </div>

      {c.rangeIssue ? (
        <p className="py-12 text-center text-sm text-gray-500">{c.rangeIssue}</p>
      ) : c.isError ? (
        <ErrorState error={c.error} onRetry={c.retry} />
      ) : !data ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Tile label="Received" value={formatMoney(data.totals.received)} />
            <Tile
              label="Reversed"
              value={formatMoney(data.totals.reversed)}
              tone={data.totals.reversed ? "text-red-700" : "text-gray-900"}
            />
            <Tile label="Net collected" value={formatMoney(data.totals.net)} tone="text-green-700" />
            <Tile label="Payments" value={String(data.totals.payments)} />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Breakdown
              title="By payment method"
              columns={["Method", "Amount", "Entries"]}
              rows={data.byMethod.map((m) => [paymentMethodLabel(m.method), formatMoney(m.amount), String(m.count)])}
            />
            <Breakdown
              title="By class"
              columns={["Class", "Amount", "Students"]}
              rows={data.byClass.map((klass) => [klass.className, formatMoney(klass.amount), String(klass.students)])}
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
    </div>
  );
};

export default CollectionsTab;
