import { useEffect } from "react";
import { ReactNode } from "react";

import { usePageHeaderContext } from "../../context/page-header-context";

interface UsePageHeaderOptions {
  title?: string;
  onBack?: () => void;
  actions?: ReactNode;
}

// pages call this once to put their title (and optional back button / actions)
// into the shared header row, instead of each page hardcoding its own <h1>
const usePageHeader = ({ title, onBack, actions }: UsePageHeaderOptions) => {
  const { setConfig } = usePageHeaderContext();

  useEffect(() => {
    setConfig({ title, onBack, actions });
    return () => setConfig(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, onBack]);
};

export default usePageHeader;
