import { useParams } from "react-router-dom";

import { useCurrentRole } from "@/context/tenant-context";
import { usePageHeaderContext } from "@/context/page-header-context";
import { homePathFor } from "@/routes/access";

export const useHeaderController = () => {
  const { organizationId } = useParams();
  // the role in the current school decides the menus and links
  const role = useCurrentRole();
  const { config: pageHeaderConfig } = usePageHeaderContext();

  const homePath = role ? homePathFor(organizationId, role) : "/organization";

  return {
    homePath,
    pageHeaderConfig,
  };
};
