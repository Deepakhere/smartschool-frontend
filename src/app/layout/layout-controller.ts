import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const COLLAPSE_STORAGE_KEY = "sidebar_collapsed";

export const useLayoutController = () => {
  // mobile drawer state only; on lg+ the sidebar is always visible via CSS
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true");
  const { pathname } = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem(COLLAPSE_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  // close the mobile drawer on nav; a no-op on desktop
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    isCollapsed,
    toggleCollapse,
  };
};
