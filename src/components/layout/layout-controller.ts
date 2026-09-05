import { useEffect, useState } from 'react';

const COLLAPSE_STORAGE_KEY = 'sidebar_collapsed';

export const useLayoutController = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true');

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem(COLLAPSE_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  return {
    isSidebarOpen,
    toggleSidebar,
    isCollapsed,
    toggleCollapse,
  };
};
