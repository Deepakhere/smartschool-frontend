import { useState } from "react";
import { useParams } from "react-router-dom";

import { useCurrentRole } from "@/entities/session/model/tenant-context";
import { usePageHeaderContext } from "@/shared/hooks/page-header/page-header-context";
import { homePathFor } from "@/entities/session/lib/access";

export const useHeaderController = () => {
  const { organizationId } = useParams();
  // the role in the current school decides the menus and links
  const role = useCurrentRole();
  const { config: pageHeaderConfig } = usePageHeaderContext();

  const homePath = role ? homePathFor(organizationId, role) : "/organization";

  // staff only; parents ask their school
  const canAskSupport = !!role && role !== "parent";
  const [isAskingSupport, setIsAskingSupport] = useState(false);

  return {
    homePath,
    pageHeaderConfig,
    canAskSupport,
    isAskingSupport,
    setIsAskingSupport,
  };
};
