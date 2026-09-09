import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllOrganizations } from "../service";
import Cookies from "js-cookie";
import { useAuth } from "@/context/auth-context";
import { USER_ACCESS_KEY, authCookieOptions } from "@/utils";
import { IOrganization } from "@/types";

const useOrganizationController = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const getAllOrganization = useGetAllOrganizations();

  const [organization, setOrganization] = useState<IOrganization[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<IOrganization | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigateHome = (organizationId: string) => {
    navigate(`/${organizationId}/${user?.role}`);
    Cookies.set(USER_ACCESS_KEY.ORGANIZATION_ID, organizationId, authCookieOptions(30));
    const workspaceName = organization.find((w) => w.id === organizationId)?.name || "";
    Cookies.set(USER_ACCESS_KEY.ORGANIZATION_NAME, workspaceName, authCookieOptions(30));
  };

  useEffect(() => {
    if (getAllOrganization.isSuccess && getAllOrganization.data) {
      if (
        getAllOrganization.data.items.length === 1 &&
        !user?.permissions?.isGlobalAdmin
      ) {
        navigateHome(getAllOrganization.data.items[0].id);
      } else {
        setOrganization(getAllOrganization.data.items);
      }
    }
    //eslint-disable-next-line
  }, [getAllOrganization.isSuccess, getAllOrganization.data]);

  const signOut = () => {
    logout();
  };

  const filteredOrganizations = organization.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return {
    getAllOrganization,
    organization: filteredOrganizations,
    hasAnyOrganization: organization.length > 0,
    isLoading: getAllOrganization.isLoading,
    navigateHome,
    signOut,
    isAddModalOpen: isAddModalOpen || !!editingOrganization,
    editingOrganization,
    openAddModal: () => setIsAddModalOpen(true),
    openEditModal: (org: IOrganization) => setEditingOrganization(org),
    closeAddModal: () => {
      setIsAddModalOpen(false);
      setEditingOrganization(null);
    },
    onOrganizationCreated: () => getAllOrganization.refetch(),
    searchTerm,
    setSearchTerm,
  };
};

export default useOrganizationController;
