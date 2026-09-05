import { Link } from "react-router-dom";
import { Bars3Icon, ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

import Avatar from "../avatar";
import KidSight from "../../icons/kidsight.png";
import { useHeaderController } from "./header-controller";

interface HeaderProps {
  onToggleSidebar: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Header = ({ onToggleSidebar, isCollapsed, onToggleCollapse }: HeaderProps) => {
  const {
    t,
    user,
    buttonRef,
    menuRef,
    isUserMenuOpen,
    pageHeaderConfig,
    profilePath,
    homePath,
    handleUserMenuToggle,
    handleLogout,
  } = useHeaderController();

  return (
    <header className="bg-white z-40">
      <div className="flex h-16">
        {/* App brand segment — width matches the sidebar so the divider lines up with it */}
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} shrink-0 px-3 border-r border-gray-200 ${
            isCollapsed ? "lg:w-16" : "lg:w-56"
          } w-auto`}
        >
          <button
            type="button"
            className="lg:hidden p-2 -ml-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={onToggleSidebar}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Link
            to={homePath}
            className={`flex-1 items-center justify-center ${isCollapsed ? "hidden" : "hidden lg:flex"}`}
          >
            <img src={KidSight} className="h-12 w-auto" alt="Kidsight Logo" />
          </Link>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-100"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Page header segment — each page registers its own title/back/actions via usePageHeader() */}
        <div className="flex-1 flex items-center justify-between px-4 min-w-0 border-b border-gray-200">
          <div className="flex items-center gap-2 min-w-0">
            {pageHeaderConfig?.onBack && (
              <button
                type="button"
                onClick={pageHeaderConfig.onBack}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title="Back"
              >
                <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <h1 className="text-base font-semibold text-gray-900 truncate">
              {pageHeaderConfig?.title || ""}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {pageHeaderConfig?.actions}

            <div className="relative">
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
                    to={profilePath}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {t("labels.your_profile")}
                  </Link>
                  {user?.isPlatformAdmin && (
                    <Link
                      to="/organization"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Switch Organization
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {t("labels.sign_out")}
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
