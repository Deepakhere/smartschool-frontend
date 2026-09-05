import { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

export const Table = ({ children }: { children: ReactNode }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">{children}</table>
  </div>
);

export const TableHeader = ({ children }: { children: ReactNode }) => (
  <thead className="bg-gray-50">
    <tr>{children}</tr>
  </thead>
);

export const TableHead = ({
  children,
  className = "",
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    scope="col"
    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    {...rest}
  >
    {children}
  </th>
);

export const TableBody = ({ children }: { children: ReactNode }) => (
  <tbody className="bg-white divide-y divide-gray-100">{children}</tbody>
);

export const TableRow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <tr className={`hover:bg-gray-50/60 transition-colors ${className}`}>{children}</tr>
);

export const TableCell = ({
  children,
  className = "",
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-4 py-3 text-sm text-gray-700 ${className}`} {...rest}>
    {children}
  </td>
);

export const TableEmpty = ({ colSpan, message }: { colSpan: number; message: string }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-gray-400">
      {message}
    </td>
  </tr>
);
