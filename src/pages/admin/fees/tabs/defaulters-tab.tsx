import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AcademicFilter, { AcademicFilterValue } from "@/components/academic-filter";
import DatePicker from "@/components/date-picker";
import ErrorState from "@/components/error-state";
import Pager from "@/components/pager";
import { Table, TableBody, TableCell, TableEmpty, TableSkeletonRows, TableHead, TableHeader, TableRow } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { exportToCsv, formatMoney } from "@/utils";
import { DEFAULTERS_PAGE_SIZE, fetchAllDefaulters, useGetFeeDefaulters } from "../service/fees-service";

const todayInIndia = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);
const formatDay = (iso: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));

const SummaryTile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
  </div>
);

// students with an instalment past its due date and still unpaid, most overdue first
const DefaultersTab = ({ organizationId }: { organizationId: string }) => {
  const [scope, setScope] = useState<AcademicFilterValue>({ academicYearId: "", classId: "", sectionId: "" });
  const [asOf, setAsOf] = useState(todayInIndia());
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const filters = useMemo(
    () => ({
      academicYearId: scope.academicYearId || undefined,
      classId: scope.classId || undefined,
      sectionId: scope.sectionId || undefined,
      asOf,
    }),
    [scope, asOf]
  );
  const report = useGetFeeDefaulters(organizationId, filters, page);
  const rows = report.data?.items ?? [];
  const total = report.data?.total_count ?? 0;
  const summary = report.data?.summary;

  const onScopeChange = useCallback((next: AcademicFilterValue) => {
    setScope(next);
    setPage(1);
  }, []);

  const onExport = async () => {
    setIsExporting(true);
    try {
      const all = await fetchAllDefaulters(organizationId, filters);
      exportToCsv(
        `fee-defaulters-${asOf}`,
        all.map((row) => ({
          student: row.student?.name ?? "",
          admission_no: row.student?.admissionNumber ?? "",
          class: row.student ? `${row.student.className} ${row.student.sectionName}`.trim() : "",
          overdue_rupees: row.overdueAmount / 100,
          outstanding_rupees: row.outstandingAmount / 100,
          oldest_due: row.oldestDueDate.slice(0, 10),
          days_overdue: row.daysOverdue,
          instalments: row.overdueInstallments.map((i) => i.label).join(" + "),
          guardian: row.student?.guardian?.name ?? "",
          phone: row.student?.guardian?.phoneNumber ?? "",
        }))
      );
    } catch {
      toast.error("The defaulters list could not be exported. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <CardTitle className="font-medium">Fee Defaulters</CardTitle>
        <Button variant="secondary" size="sm" onClick={onExport} loading={isExporting} disabled={total === 0}>
          Export to Excel
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <AcademicFilter organizationId={organizationId} value={scope} onChange={onScopeChange} />
        <DatePicker label="Overdue as of" value={asOf} onChange={(value) => { setAsOf(value); setPage(1); }} />
      </div>

      {summary && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryTile label="Students overdue" value={String(summary.students)} />
          <SummaryTile label="Overdue" value={formatMoney(summary.overdueAmount)} />
          <SummaryTile label="Total outstanding" value={formatMoney(summary.outstandingAmount)} />
        </div>
      )}

      {report.isError ? (
        <ErrorState error={report.error} onRetry={() => report.refetch()} />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableHead>Student</TableHead>
              <TableHead className="text-center">Class</TableHead>
              <TableHead className="text-center">Overdue</TableHead>
              <TableHead className="text-center">Outstanding</TableHead>
              <TableHead className="text-center">Oldest due</TableHead>
              <TableHead className="text-center">Guardian</TableHead>
            </TableHeader>
            <TableBody>
              {report.isLoading || !scope.academicYearId ? (
                <TableSkeletonRows columns={6} />
              ) : rows.length === 0 ? (
                <TableEmpty colSpan={6} title="No overdue fees" description="Every instalment due by this date has been paid." />
              ) : (
                rows.map((row) => (
                  <TableRow key={row.studentFeeId}>
                    <TableCell>
                      <p className="font-medium text-gray-900">{row.student?.name}</p>
                      {row.student?.admissionNumber && <p className="text-xs text-gray-500">{row.student.admissionNumber}</p>}
                    </TableCell>
                    <TableCell className="text-center">{row.student ? `${row.student.className} ${row.student.sectionName}` : ""}</TableCell>
                    <TableCell className="text-center">
                      <p className="font-medium text-red-700">{formatMoney(row.overdueAmount)}</p>
                      <p className="text-xs text-gray-500">{row.overdueInstallments.map((i) => i.label).join(", ")}</p>
                    </TableCell>
                    <TableCell className="text-center">{formatMoney(row.outstandingAmount)}</TableCell>
                    <TableCell className="text-center">
                      <p>{formatDay(row.oldestDueDate)}</p>
                      <Badge tone={row.daysOverdue > 30 ? "red" : "yellow"}>{row.daysOverdue} days</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {row.student?.guardian ? (
                        <>
                          <p>{row.student.guardian.name}</p>
                          {row.student.guardian.phoneNumber && (
                            <a href={`tel:${row.student.guardian.phoneNumber}`} className="text-xs text-primary-600 underline">
                              {row.student.guardian.phoneNumber}
                            </a>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">No guardian</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pager page={page} pageSize={DEFAULTERS_PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      )}
    </Card>
  );
};

export default DefaultersTab;
