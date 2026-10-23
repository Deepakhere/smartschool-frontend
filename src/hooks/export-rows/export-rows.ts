import { useState } from "react";
import toast from "react-hot-toast";

import type { ItemLabel } from "@/components/data-table";
import { Paged } from "@/types";
import { exportToCsv, fetchRows } from "@/utils";

type CsvRow = Record<string, string | number | null | undefined>;

interface ExportRowsOptions<T> {
  fileName: string;
  // rows matching the current filters
  total: number;
  itemLabel: ItemLabel;
  // one page of the list, with the screen's current filters
  fetchPage: (page: number, limit: number) => Promise<Paged<T>>;
  toCsvRow: (row: T) => CsvRow;
}

// Export button -> dialog asking how many rows -> fetch them page by page -> CSV download
const useExportRows = <T>({ fileName, total, itemLabel, fetchPage, toCsvRow }: ExportRowsOptions<T>) => {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const onExport = async (count: number) => {
    setIsExporting(true);
    try {
      const rows = await fetchRows(fetchPage, count);
      if (!rows.length) {
        toast.error("There is nothing to export.");
        return;
      }
      exportToCsv(fileName, rows.map(toCsvRow));
      setOpen(false);
    } catch {
      toast.error("The export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    openExport: () => setOpen(true),
    exportDialog: { open, onClose: () => setOpen(false), total, itemLabel, isExporting, onExport },
  };
};

export default useExportRows;
