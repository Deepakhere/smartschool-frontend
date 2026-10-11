import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader as UiTableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// TableHeader here takes bare <TableHead> children and wraps them in the one header
// row every table in the app uses - callers don't write <tr> themselves
const TableHeader = UiTableHeader;

const TableEmpty = ({ colSpan, message }: { colSpan: number; message: string }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="py-10 text-center text-gray-400">
      {message}
    </TableCell>
  </TableRow>
);

// a table-shaped placeholder for while the rows are loading - keeps the header and
// container in place instead of swapping the whole card for a spinner
const TableSkeleton = ({ columns, rows = 5 }: { columns: number; rows?: number }) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex} className="hover:bg-transparent">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <TableCell key={colIndex}>
            <Skeleton className="h-4 w-full max-w-[12rem]" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

export { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableEmpty, TableSkeleton };
