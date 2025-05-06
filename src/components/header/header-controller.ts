import { useState } from "react";
import { useAuth } from "../../context/auth-context";

export const useHeaderController = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user,
    isUserMenuOpen,
    isSidebarOpen,
    handleUserMenuToggle,
    handleLogout,
    toggleSidebar,
    setIsUserMenuOpen,
  };
};
