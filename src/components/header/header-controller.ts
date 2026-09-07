import { useParams } from "react-router-dom";

import { useAuth } from "../../context/auth-context";
import { usePageHeaderContext } from "../../context/page-header-context";

export const useHeaderController = () => {
  const { organizationId } = useParams();
  const { user } = useAuth();
  const { config: pageHeaderConfig } = usePageHeaderContext();

  const homePath = `/${organizationId}/${user?.role}/dashboard`;

  return {
    homePath,
    pageHeaderConfig,
  };
};
