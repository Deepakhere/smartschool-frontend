import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useCan } from "../context/tenant-context";
import { PermissionKey } from "../types";
import { SHARED_PAGES } from "./shared-pages";

const PermissionGate = ({ anyOf, children }: { anyOf: PermissionKey[]; children: ReactNode }) => {
  const can = useCan();
  return can(...anyOf) ? <>{children}</> : <Navigate to="/not-access" replace />;
};

export const FirstPermittedPage = () => {
  const can = useCan();
  const first = SHARED_PAGES.find((page) => can(...page.anyOf));
  return <Navigate to={first ? first.path.replace("/*", "") : "profile"} replace />;
};

export default PermissionGate;
