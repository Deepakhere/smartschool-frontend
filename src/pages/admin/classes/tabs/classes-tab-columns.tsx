import { DataTableColumn } from "@/components/data-table";
import RowMenu, { RowMenuItem } from "@/components/row-menu";
import StatusBadge from "@/components/status-badge";
import { IClass } from "@/types";

export const classColumns = (menuFor: (klass: IClass) => RowMenuItem[]): DataTableColumn<IClass>[] => [
  {
    id: "name",
    header: "Class",
    cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span>,
  },
  {
    id: "numericLevel",
    header: "Level",
    meta: { align: "center" },
    cell: ({ row }) => row.original.numericLevel ?? "-",
  },
  { id: "sections", header: "Sections", meta: { align: "center" }, cell: ({ row }) => row.original.sectionCount ?? 0 },
  { id: "students", header: "Students", meta: { align: "center" }, cell: ({ row }) => row.original.studentCount ?? 0 },
  {
    id: "status",
    header: "Status",
    meta: { align: "center" },
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    meta: { align: "center" },
    cell: ({ row }) => <RowMenu items={menuFor(row.original)} />,
  },
];
