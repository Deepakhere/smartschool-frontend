import { useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { DataTableProps, ServerPagination } from "./data-table.types";

const isServerPaged = <T,>(p: DataTableProps<T>["pagination"]): p is ServerPagination => !!p && "onPageChange" in p;

const useDataTable = <T,>({ columns, data, getRowId, pagination }: DataTableProps<T>) => {
  const serverPaged = isServerPaged(pagination);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [localPage, setLocalPage] = useState<PaginationState>({ pageIndex: 0, pageSize: pagination?.pageSize ?? 1000 });
  // stay on a real page when the list shrinks (a delete, a refetch)
  const pageIndex = Math.min(localPage.pageIndex, Math.max(0, Math.ceil(data.length / localPage.pageSize) - 1));

  const table = useReactTable({
    data,
    columns,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    state: {
      sorting,
      pagination: serverPaged ? { pageIndex: 0, pageSize: data.length || 1 } : { ...localPage, pageIndex },
    },
    onSortingChange: setSorting,
    onPaginationChange: setLocalPage,
    // a new data array (e.g. `?? []` while loading) must not reset the page, or it loops
    autoResetPageIndex: false,
    manualPagination: serverPaged,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: serverPaged || !pagination ? undefined : getPaginationRowModel(),
  });

  // what the pager shows, for either kind of paging
  const pager = serverPaged
    ? pagination
    : pagination
      ? {
          page: pageIndex + 1,
          pageSize: localPage.pageSize,
          total: data.length,
          onPageChange: (page: number) => setLocalPage((current) => ({ ...current, pageIndex: page - 1 })),
          onPageSizeChange: (size: number) => setLocalPage({ pageIndex: 0, pageSize: size }),
        }
      : null;

  return { table, pager };
};

export default useDataTable;
