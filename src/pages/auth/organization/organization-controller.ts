import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllOrganizations } from "../service";
import Cookies from "js-cookie";
import { useAuth } from "../../../context/auth-context";
import { USER_ACCESS_KEY } from "../../../utils";
import { IOrganization } from "../../../types";

const useOrganizationController = () => {
  const { logout } = useAuth();
  const getAllOrganization = useGetAllOrganizations();

  const [workspaces, setWorkspaces] = useState<IOrganization[]>([]);
  const navigate = useNavigate();

  const navigateHome = (workspaceId: string) => {
    navigate(`/${workspaceId}`);
    Cookies.set(USER_ACCESS_KEY.ORGANIZATION_ID, workspaceId, {
      secure: true,
      sameSite: "lax",
    });
    const workspaceName =
      workspaces.find((w) => w.id === workspaceId)?.name || "";
    Cookies.set(USER_ACCESS_KEY.ORGANIZATION_NAME, workspaceName, {
      secure: true,
      sameSite: "lax",
    });
  };

  useEffect(() => {
    if (getAllOrganization.isSuccess && getAllOrganization.data) {
      if (getAllOrganization.data.items.length === 1) {
        navigateHome(getAllOrganization.data.items[0].id);
      } else {
        setWorkspaces(getAllOrganization.data.items);
      }
    }
    //eslint-disable-next-line
  }, [getAllOrganization.isSuccess, getAllOrganization.data]);

  const signOut = () => {
    logout();
  };
  return {
    getAllOrganization,
    workspaces,
    isLoading: getAllOrganization.isLoading,
    navigateHome,
    signOut,
  };
};

export default useOrganizationController;
