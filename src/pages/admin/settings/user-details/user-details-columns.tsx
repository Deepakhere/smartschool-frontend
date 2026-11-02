import { TFunction } from "i18next";

import { DataTableColumn } from "@/shared/ui/data-table";
import { Badge, BadgeTone } from "@/shared/ui/kit/badge";
import RowMenu, { type RowMenuItem } from "@/shared/ui/row-menu";
import { IAllUserDetails } from "@/entities/user";

const STATUS_TONE: Record<string, BadgeTone> = { active: "green", pending: "yellow", suspended: "red" };

interface UserColumnActions {
  t: TFunction;
  isSelf: (userId: string) => boolean;
  manageAccess: (userId: string) => void;
  edit: (userId: string) => void;
  remove: (userId: string) => void;
}

export const userColumns = ({
  t,
  isSelf,
  manageAccess,
  edit,
  remove,
}: UserColumnActions): DataTableColumn<IAllUserDetails>[] => [
  {
    id: "name",
    header: t("labels.username"),
    cell: ({ row }) => <span className="text-gray-900">{row.original.name}</span>,
  },
  { id: "email", header: t("labels.email"), meta: { align: "center" }, cell: ({ row }) => row.original.email },
  {
    id: "role",
    header: t("labels.role"),
    meta: { align: "center" },
    cell: ({ row }) => (
      <Badge tone={row.original.role === "admin" ? "green" : "gray"} className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    id: "status",
    header: "Status",
    meta: { align: "center" },
    cell: ({ row }) => (
      <Badge tone={STATUS_TONE[row.original.status] ?? "gray"} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: t("labels.actions"),
    meta: { align: "center" },
    cell: ({ row }) => {
      const user = row.original;
      const items: RowMenuItem[] = [
        ...(user.role !== "parent" ? [{ label: "Manage access", onSelect: () => manageAccess(user.id) }] : []),
        { label: t("labels.edit"), onSelect: () => edit(user.id) },
        ...(!isSelf(user.id) ? [{ label: "Remove", danger: true, onSelect: () => remove(user.id) }] : []),
      ];
      return <RowMenu items={items} />;
    },
  },
];
