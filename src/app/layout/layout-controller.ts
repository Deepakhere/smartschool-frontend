import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useLayoutStore } from "@/shared/model/layout-store";

// the menu drawer (below 1024px) closes whenever the page changes; a no-op on desktop
export const useLayoutController = () => {
  const closeSidebar = useLayoutStore((state) => state.closeSidebar);
  const { pathname } = useLocation();

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);
};
