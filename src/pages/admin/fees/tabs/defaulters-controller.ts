import { useCallback, useMemo, useState } from "react";

import { AcademicFilterValue } from "@/components/academic-filter";
import { useExportRows, usePaging } from "@/hooks";
import { IFeeDefaulter } from "@/types";
import { todayInIndia } from "@/utils";
import { fetchDefaultersPage, useGetFeeDefaulters } from "../service/fees-service";

const useDefaultersController = (organizationId: string) => {
  const [scope, setScope] = useState<AcademicFilterValue>({ academicYearId: "", classId: "", sectionId: "" });
  const [asOf, setAsOf] = useState(todayInIndia());
  const { page, pageSize, setPage, setPageSize, resetPage } = usePaging();

  const filters = useMemo(
    () => ({
      academicYearId: scope.academicYearId || undefined,
      classId: scope.classId || undefined,
      sectionId: scope.sectionId || undefined,
      asOf: asOf || undefined,
    }),
    [scope, asOf]
  );
  const report = useGetFeeDefaulters(organizationId, filters, page, pageSize);
  const total = report.data?.pagination.totalItems ?? 0;

  const onScopeChange = useCallback(
    (next: AcademicFilterValue) => {
      setScope(next);
      resetPage();
    },
    [resetPage]
  );

  const onAsOfChange = (value: string) => {
    setAsOf(value);
    resetPage();
  };

  const { openExport, exportDialog } = useExportRows<IFeeDefaulter>({
    fileName: `fee-defaulters-${asOf}`,
    total,
    itemLabel: { one: "defaulter", other: "defaulters" },
    fetchPage: (page, limit) => fetchDefaultersPage(organizationId, filters, page, limit),
    toCsvRow: (row) => ({
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
    }),
  });

  return {
    scope,
    asOf,
    onScopeChange,
    onAsOfChange,
    rows: report.data?.rows ?? [],
    summary: report.data?.summary,
    // no year picked yet means the filter is still loading its default
    isLoading: report.isLoading || !scope.academicYearId,
    isError: report.isError,
    error: report.error,
    retry: () => report.refetch(),
    pagination: { page, pageSize, total, onPageChange: setPage, onPageSizeChange: setPageSize },
    openExport,
    exportDialog,
  };
};

export default useDefaultersController;
