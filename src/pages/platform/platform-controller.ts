import { useState } from "react";
import toast from "react-hot-toast";

import {
  useGetAccounts,
  useCreateAccount,
  useAddOrganizationToAccount,
  useUpdateAccountStatus,
} from "./service/platform-service";
import { ICreateAccountValue, IAddOrganizationToAccountValue } from "@/types";

interface StatusTarget {
  accountId: string;
  name: string;
  currentStatus: string;
}

export const usePlatformController = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [addSchoolAccountId, setAddSchoolAccountId] = useState<string | null>(null);
  const [statusTarget, setStatusTarget] = useState<StatusTarget | null>(null);

  const accounts = useGetAccounts();
  const createAccount = useCreateAccount();
  const addOrganization = useAddOrganizationToAccount(addSchoolAccountId || "");
  const updateStatus = useUpdateAccountStatus();

  const handleCreateAccount = (value: ICreateAccountValue) =>
    createAccount.mutate(value, {
      onSuccess: (data) => {
        toast.success(
          data?.ownerInvited
            ? "Customer created. An invite email was sent to the owner."
            : "Customer created. The existing owner now has access."
        );
        setIsCreateModalOpen(false);
      },
      onError: (error) => toast.error(error?.response?.Error?.message || "Failed to create customer"),
    });

  const handleAddOrganization = (value: IAddOrganizationToAccountValue) =>
    addOrganization.mutate(value, {
      onSuccess: () => {
        toast.success("School added successfully.");
        setAddSchoolAccountId(null);
      },
      onError: (error) => toast.error(error?.response?.Error?.message || "Failed to add school"),
    });

  const confirmStatusChange = () => {
    if (!statusTarget) return;
    const status = statusTarget.currentStatus === "suspended" ? "active" : "suspended";
    updateStatus.mutate(
      { accountId: statusTarget.accountId, status },
      {
        onSuccess: () => {
          toast.success(status === "suspended" ? "Customer suspended." : "Customer reactivated.");
          setStatusTarget(null);
        },
        onError: (error) => toast.error(error?.response?.Error?.message || "Failed to update status"),
      }
    );
  };

  return {
    accounts: accounts.data?.items || [],
    isLoading: accounts.isLoading,
    loadError: accounts.isError ? accounts.error : null,
    retryLoad: () => accounts.refetch(),
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleCreateAccount,
    isCreatingAccount: createAccount.isPending,
    addSchoolAccountId,
    setAddSchoolAccountId,
    handleAddOrganization,
    isAddingOrganization: addOrganization.isPending,
    statusTarget,
    setStatusTarget,
    confirmStatusChange,
    isUpdatingStatus: updateStatus.isPending,
  };
};
