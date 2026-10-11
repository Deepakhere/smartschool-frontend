import ErrorState from "@/components/error-state";
import { PlusIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

import Spinner from "@/components/spinner";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { usePlatformController } from "./platform-controller";
import CreateAccountModal from "./create-account-modal";
import AddSchoolModal from "./add-school-modal";

const statusBadgeClass: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  trial: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
};

const Platform = () => {
  const c = usePlatformController();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Platform Console</h1>
            <p className="text-sm text-gray-500 mt-1">Manage customers and their schools</p>
          </div>
          <Button onClick={() => c.setIsCreateModalOpen(true)}>
            <PlusIcon className="h-5 w-5" />
            New Customer
          </Button>
        </div>

        {c.loadError ? (
          <ErrorState error={c.loadError} onRetry={c.retryLoad} />
        ) : c.isLoading ? (
          <Spinner />
        ) : c.accounts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">No customers yet.</div>
        ) : (
          <div className="space-y-6">
            {c.accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {account.name}{" "}
                      <span className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full capitalize ${statusBadgeClass[account.status]}`}>
                        {account.status}
                      </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Owner: {typeof account.ownerUserId === "object" ? `${account.ownerUserId.name} (${account.ownerUserId.email})` : ""}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => c.setAddSchoolAccountId(account.id)}>
                      + Add School
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        c.setStatusTarget({ accountId: account.id, name: account.name, currentStatus: account.status })
                      }
                      className={
                        account.status === "suspended"
                          ? "border-green-300 text-green-700 hover:bg-green-50"
                          : "border-red-300 text-red-700 hover:bg-red-50"
                      }
                    >
                      {account.status === "suspended" ? "Reactivate" : "Suspend"}
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {account.organizations.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-gray-500">No schools yet.</p>
                  ) : (
                    account.organizations.map((org) => (
                      <div key={org.id} className="px-6 py-4 flex items-center gap-3">
                        <BuildingOffice2Icon className="h-5 w-5 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{org.name}</p>
                          <p className="text-xs text-gray-500">{org.address}</p>
                        </div>
                        <span className={`ml-auto inline-block px-2 py-0.5 text-xs rounded-full capitalize ${statusBadgeClass[org.status] || "bg-gray-100 text-gray-600"}`}>
                          {org.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateAccountModal
        isOpen={c.isCreateModalOpen}
        onClose={() => c.setIsCreateModalOpen(false)}
        onSubmit={c.handleCreateAccount}
        isSubmitting={c.isCreatingAccount}
      />

      <AddSchoolModal
        isOpen={!!c.addSchoolAccountId}
        onClose={() => c.setAddSchoolAccountId(null)}
        onSubmit={c.handleAddOrganization}
        isSubmitting={c.isAddingOrganization}
      />

      <DeleteConfirmationDialog
        open={!!c.statusTarget}
        onClose={() => c.setStatusTarget(null)}
        onConfirm={c.confirmStatusChange}
        isLoading={c.isUpdatingStatus}
        tone={c.statusTarget?.currentStatus === "suspended" ? "neutral" : "danger"}
        title={c.statusTarget?.currentStatus === "suspended" ? "Reactivate customer?" : "Suspend customer?"}
        description={
          c.statusTarget?.currentStatus === "suspended"
            ? `${c.statusTarget?.name} and all their schools get access again.`
            : `Everyone at ${c.statusTarget?.name}'s schools loses access until you reactivate the account.`
        }
        confirmLabel={c.statusTarget?.currentStatus === "suspended" ? "Reactivate" : "Suspend"}
      />
    </div>
  );
};

export default Platform;
