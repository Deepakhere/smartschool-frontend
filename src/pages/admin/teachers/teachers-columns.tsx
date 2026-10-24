import { DataTableColumn } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ITeacherDirectoryEntry } from "@/types";

export const teacherColumns = (edit: (teacher: ITeacherDirectoryEntry) => void): DataTableColumn<ITeacherDirectoryEntry>[] => [
  { id: "name", header: "Name", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span> },
  { id: "email", header: "Email", meta: { className: "text-gray-500" }, cell: ({ row }) => row.original.email },
  {
    id: "employeeCode",
    header: "Employee Code",
    meta: { className: "text-gray-500" },
    cell: ({ row }) => row.original.staffProfile?.employeeCode || "-",
  },
  {
    id: "designation",
    header: "Designation",
    meta: { className: "text-gray-500" },
    cell: ({ row }) => row.original.staffProfile?.designation || "-",
  },
  {
    id: "department",
    header: "Department",
    meta: { className: "text-gray-500" },
    cell: ({ row }) => row.original.staffProfile?.department || "-",
  },
  {
    id: "actions",
    header: "Actions",
    meta: { align: "right" },
    cell: ({ row }) => (
      <Button variant="link" onClick={() => edit(row.original)}>
        Edit profile
      </Button>
    ),
  },
];
