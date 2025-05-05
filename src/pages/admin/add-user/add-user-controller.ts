import { useEffect, useState } from "react";

import { IAddUserValue, IAllUserDetails } from "../../../types";
import { useAddUserDetail, useGetAllUserDetails } from "./service";
import { useError } from "../../../hooks";

const useAddUserController = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"all" | "admin" | "parent">("all");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    role: "parent" as "admin" | "parent",
    permissions: {
      canRead: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    },
  });

  const [users, setUsers] = useState<IAllUserDetails[]>([]);

  const addUserDetail = useAddUserDetail();
  const getAllUserDetails = useGetAllUserDetails();

  useError({
    mutation: addUserDetail,
  });

  const filteredUsers = users.filter(
    (user) => sortBy === "all" || user.role === sortBy
  );

  const handleSubmituserDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const userDetails: IAddUserValue = {
      name: formData.fullname,
      email: formData.email,
      role: formData.role,
      permissions: {
        canRead: formData.permissions.canRead,
        canCreate: formData.permissions.canCreate,
        canUpdate: formData.permissions.canUpdate,
        canDelete: formData.permissions.canDelete,
      },
    };

    addUserDetail.mutate({ ...userDetails });
  };

  useEffect(() => {
    if (addUserDetail.isSuccess) {
      setIsModalOpen(false);
      getAllUserDetails.remove();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUserDetail.isSuccess]);

  useEffect(() => {
    if (getAllUserDetails.isSuccess && getAllUserDetails.data) {
      setUsers(getAllUserDetails.data.items);
    }
  }, [getAllUserDetails.isSuccess, getAllUserDetails.data]);

  return {
    sortBy,
    formData,
    isModalOpen,
    filteredUsers,
    isLoadingAddUserDetail: addUserDetail.isLoading,
    setSortBy,
    setFormData,
    setIsModalOpen,
    handleSubmituserDetails,
  };
};

export default useAddUserController;
