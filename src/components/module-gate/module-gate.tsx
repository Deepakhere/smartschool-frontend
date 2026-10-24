import { ReactNode } from "react";

import EmptyState from "@/components/empty-state";
import { useCurrentRole, useHasModule } from "@/context/tenant-context";
import { ModuleKey } from "@/types";
import LockedBanner from "./locked-banner";
import { ModuleLockContext } from "./module-lock-context";

const UNLOCKED = { module: null, readOnly: false };

// locked module: read-only for staff, unavailable for parents
const ModuleGate = ({ module, children }: { module: ModuleKey; children: ReactNode }) => {
  const hasModule = useHasModule();
  const role = useCurrentRole();

  if (hasModule(module)) return <ModuleLockContext.Provider value={UNLOCKED}>{children}</ModuleLockContext.Provider>;
  if (role === "parent") {
    return <EmptyState title="Not available" description="This section isn't offered by your school." />;
  }
  return (
    <ModuleLockContext.Provider value={{ module, readOnly: true }}>
      <LockedBanner module={module} />
      {children}
    </ModuleLockContext.Provider>
  );
};

export default ModuleGate;
