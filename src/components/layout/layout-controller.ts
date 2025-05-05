import { useState } from 'react';

export const useLayoutController = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return {
    isSidebarOpen,
    toggleSidebar,
  };
}; 