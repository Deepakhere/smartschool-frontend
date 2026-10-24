import { useEffect } from "react";

import { usePageHeaderContext } from "@/context/page-header-context";

interface UsePageHeaderOptions {
  title?: string;
  onBack?: () => void;
}

// pages call this to put their title and optional back button in the top bar
const usePageHeader = ({ title, onBack }: UsePageHeaderOptions) => {
  const { setConfig } = usePageHeaderContext();

  useEffect(() => {
    setConfig({ title, onBack });
    return () => setConfig(null);
  }, [title, onBack, setConfig]);
};

export default usePageHeader;
