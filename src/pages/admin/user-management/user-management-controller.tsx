import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { useParams } from "react-router-dom";

import {
  IAddUserValue,
  IAllUserDetails,
  IRoleOptionDropDown,
  PermissionOption,
  RoleOption,
} from "../../../types";
import { useAddUserDetail, useGetAllUserDetails } from "./service";
import { useError } from "../../../hooks";

const useUserManagementController = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"all" | "admin" | "parent">("all");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    role: "admin" as "admin" | "parent",
    permissions: {
      canRead: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    },
  });

  const [users, setUsers] = useState<IAllUserDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const addUserDetail = useAddUserDetail(organizationId || "");
  const getAllUserDetails = useGetAllUserDetails(
    organizationId || "",
    searchTerm,
    filterRole
  );

  useError({
    mutation: addUserDetail,
  });

  const onRoleChange = (role: string) => {
    setSortBy(role as "all" | "admin" | "parent");
    const roleVal = role === "all" ? "" : role;
    setFilterRole(roleVal);
  };

  const onSearchInputChange = debounce((searchVal: string) => {
    setSearchTerm(searchVal);
  }, 500);

  useEffect(() => {
    getAllUserDetails.refetch();
    //eslint-disable-next-line
  }, [searchTerm, filterRole]);

  const roleOptionsDropDown: IRoleOptionDropDown[] = [
    {
      value: "all",
      label: "All Users",
      description: "View all user types",
      icon: (
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      value: "admin",
      label: "Administrators",
      description: "View admin users only",
      icon: (
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      value: "parent",
      label: "Parents",
      description: "View parent users only",
      icon: (
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const roleOptions: RoleOption[] = [
    {
      value: "admin",
      label: "Administrator",
      description: "Full access to manage users and content",
      icon: (
        <svg
          className="h-5 w-5 text-indigo-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      value: "parent",
      label: "Parent",
      description: "View-only access to student information",
      icon: (
        <svg
          className="h-5 w-5 text-indigo-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const permissionOptions: PermissionOption[] = [
    {
      id: "canRead",
      label: "Read",
      description: "View content and data",
      icon: (
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "canCreate",
      label: "Create",
      description: "Add new content",
      icon: (
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "canUpdate",
      label: "Update",
      description: "Modify existing content",
      icon: (
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      ),
    },
    {
      id: "canDelete",
      label: "Delete",
      description: "Remove content",
      icon: (
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const handlePermissionChange = (
    permission: keyof typeof formData.permissions
  ) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission],
      },
    });
  };

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
    users,
    isLoadingAddUserDetail: addUserDetail.isLoading,
    isLoadingGetAllUserDetails: getAllUserDetails.isLoading,
    isFetchingGetAllUserDetails: getAllUserDetails.isFetching,
    roleOptions,
    permissionOptions,
    roleOptionsDropDown,
    searchTerm,
    onSearchInputChange,
    onRoleChange,
    setSearchTerm,
    setSortBy,
    setFormData,
    setIsModalOpen,
    handleSubmituserDetails,
    handlePermissionChange,
  };
};

export default useUserManagementController;
