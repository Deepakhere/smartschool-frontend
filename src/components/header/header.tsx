import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";

import Avatar from "../avatar";
import KidSight from "../../icons/kidsight.png";
import { useHeaderController } from "./header-controller";

const Header = () => {
  const {
    user,
    buttonRef,
    menuRef,
    isUserMenuOpen,
    organizationId,
    handleUserMenuToggle,
    handleLogout,
    toggleSidebar,
  } = useHeaderController();

  return (
    <header className="bg-white shadow-md z-40">
      <div className="w-full px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center lg:pl-3">
              <Link
                to="/admin/dashboard"
                className="text-xl font-bold text-gray-900"
              >
                <img
                  src={KidSight}
                  height={60}
                  width={160}
                  alt="Kidsight Logo"
                />
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  ref={buttonRef}
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="user-menu-button"
                  onClick={handleUserMenuToggle}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  {user && user?.name && <Avatar name={user?.name} />}
                </button>
              </div>
              {isUserMenuOpen && (
                <div
                  ref={menuRef}
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <Link
                    to={`${organizationId}/admin/settings/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
