import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllOrganizations } from "../service";
import Cookies from "js-cookie";
import { useAuth } from "../../../context/auth-context";
import { USER_ACCESS_KEY } from "../../../utils";
import { IOrganization } from "../../../types";

const useOrganizationController = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const getAllOrganization = useGetAllOrganizations();

  const [organization, setOrganization] = useState<IOrganization[]>([]);

  const navigateHome = (organizationId: string) => {
    navigate(`/${organizationId}/${user?.role}`);
    Cookies.set(USER_ACCESS_KEY.ORGANIZATION_ID, organizationId, {
      secure: true,
      sameSite: "lax",
    });
    const workspaceName =
      organization.find((w) => w.id === organizationId)?.name || "";
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
        setOrganization(getAllOrganization.data.items);
      }
    }
    //eslint-disable-next-line
  }, [getAllOrganization.isSuccess, getAllOrganization.data]);

  const signOut = () => {
    logout();
  };
  return {
    getAllOrganization,
    organization,
    isLoading: getAllOrganization.isLoading,
    navigateHome,
    signOut,
  };
};

export default useOrganizationController;
