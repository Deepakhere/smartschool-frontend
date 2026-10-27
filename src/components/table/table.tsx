import { ReactNode } from "react";

import EmptyState from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader as UiTableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

// TableHeader here takes bare <TableHead> children and wraps them in the one header
// row every table in the app uses - callers don't write <tr> themselves
const TableHeader = UiTableHeader;

// an empty table body, drawn with the app's one empty state
const TableEmpty = ({
  colSpan,
  title,
  description,
  action,
}: {
  colSpan: number;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="p-0">
      <EmptyState title={title} description={description} action={action} />
    </TableCell>
  </TableRow>
);

// loading rows that keep the table's header and card in place
const TableSkeletonRows = ({ columns, rows = 5 }: { columns: number; rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex} className="hover:bg-transparent">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex}>
            <Skeleton className="h-4 w-full max-w-[12rem]" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableEmpty, TableSkeletonRows };
