import { useParams } from "react-router-dom";

import { useCurrentRole } from "@/context/tenant-context";
import { usePageHeaderContext } from "@/context/page-header-context";

export const useHeaderController = () => {
  const { organizationId } = useParams();
  // the role in the current school decides the menus and links
  const role = useCurrentRole();
  const { config: pageHeaderConfig } = usePageHeaderContext();

  const homePath = `/${organizationId}/${role}/dashboard`;

  return {
    homePath,
    pageHeaderConfig,
  };
};
