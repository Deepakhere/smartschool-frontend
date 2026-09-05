import { createContext, useContext, useState, ReactNode } from "react";

export interface PageHeaderConfig {
  title?: string;
  onBack?: () => void;
  actions?: ReactNode;
}

interface PageHeaderContextValue {
  config: PageHeaderConfig | null;
  setConfig: (config: PageHeaderConfig | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue | undefined>(undefined);

export const PageHeaderProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<PageHeaderConfig | null>(null);

  return (
    <PageHeaderContext.Provider value={{ config, setConfig }}>
      {children}
    </PageHeaderContext.Provider>
  );
};

export const usePageHeaderContext = () => {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error("usePageHeaderContext must be used within a PageHeaderProvider");
  }
  return context;
};
