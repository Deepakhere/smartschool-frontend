import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { AcademicFilterValue } from "@/components/academic-filter";
import { usePaging } from "@/hooks";
import { exportToCsv, todayInIndia } from "@/utils";
import { fetchAllDefaulters, useGetFeeDefaulters } from "../service/fees-service";

const useDefaultersController = (organizationId: string) => {
  const [scope, setScope] = useState<AcademicFilterValue>({ academicYearId: "", classId: "", sectionId: "" });
  const [asOf, setAsOf] = useState(todayInIndia());
  const { page, pageSize, setPage, setPageSize, resetPage } = usePaging();
  const [isExporting, setIsExporting] = useState(false);

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
    isExporting,
    onExport,
  };
};

export default useDefaultersController;
