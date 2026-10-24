import { createContext, useContext } from "react";

import { ModuleKey } from "@/types";

export interface ModuleLock {
  module: ModuleKey | null;
  readOnly: boolean;
}

export const ModuleLockContext = createContext<ModuleLock>({ module: null, readOnly: false });

export const useModuleLock = () => useContext(ModuleLockContext);
