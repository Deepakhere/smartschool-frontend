import { useEffect, useRef } from "react";

import { usePageHeaderContext } from "@/context/page-header-context";

interface UsePageHeaderOptions {
  title?: string;
  onBack?: () => void;
}

// pages call this to put their title and optional back button in the top bar
const usePageHeader = ({ title, onBack }: UsePageHeaderOptions) => {
  const { setConfig } = usePageHeaderContext();
  // the latest handler runs on click; a new function each render must not re-register the header,
  // since that re-renders the page and would loop
  const latestBack = useRef(onBack);
  latestBack.current = onBack;
  const hasBack = !!onBack;

  useEffect(() => {
    setConfig({ title, onBack: hasBack ? () => latestBack.current?.() : undefined });
    return () => setConfig(null);
  }, [title, hasBack, setConfig]);
};

export default usePageHeader;
