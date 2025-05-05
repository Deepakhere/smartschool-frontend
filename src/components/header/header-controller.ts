import { useState } from "react";
import { useAuth } from "../../context/auth-context";

export const useHeaderController = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { logout } = useAuth();

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return {
    isUserMenuOpen,
    handleUserMenuToggle,
    handleLogout,
  };
};
