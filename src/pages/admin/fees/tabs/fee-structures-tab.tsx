import { PlusIcon } from "@heroicons/react/20/solid";

import DataTable from "@/shared/ui/data-table";
import ErrorState from "@/shared/ui/error-state";
import FeeStructureDrawer from "../components/fee-structure-drawer";
import { feeStructureColumns } from "./fee-structures-columns";
import useFeeStructuresController from "./fee-structures-controller";

const FeeStructuresTab = ({ organizationId }: { organizationId: string }) => {
  const c = useFeeStructuresController(organizationId);
  const columns = feeStructureColumns({ assigningId: c.assigningId, assign: c.onAssign, edit: c.startEdit });

  return (
    <div className="space-y-6">
      <FeeStructureDrawer c={c} />

      <div>
        {c.structuresError ? (
          <ErrorState error={c.structuresError} onRetry={c.retryStructures} />
        ) : (
          <DataTable
            columns={columns}
            data={c.structures}
            getRowId={(structure) => structure.id}
            isLoading={c.isLoadingStructures}
            itemLabel={{ one: "structure", other: "structures" }}
            pagination={{ pageSize: 20 }}
            actions={[{ label: "New structure", icon: PlusIcon, variant: "primary", onClick: c.openCreate }]}
            empty={{
              title: "No fee structures yet",
              description: "Create one, then assign it to a class to bill its students.",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FeeStructuresTab;
