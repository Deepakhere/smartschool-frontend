import { NavLink } from "react-router-dom";

import SidebarUserMenu from "../sidebar-user-menu";
import NotificationBell from "../notification-bell";
import { useSidebarController } from "./sidebar-controller";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const { sections } = useSidebarController();

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-56"
      } app-shell-surface shrink-0 bg-white border-r border-gray-200 z-10 transition-[width] duration-300 ease-in-out flex flex-col h-full`}
    >
      <div className="flex-1 overflow-y-auto pb-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex === 0 ? "pt-3" : "pt-4 mt-4 border-t border-gray-100"}>
            {section.label && (
              <p
                className={`px-3 overflow-hidden whitespace-nowrap text-xs font-semibold text-gray-400 uppercase tracking-wider transition-all duration-300 ease-in-out ${
                  isCollapsed ? "max-h-0 opacity-0 pb-0" : "max-h-6 opacity-100 pb-2"
                }`}
              >
                {section.label}
              </p>
            )}
            <nav className="px-2 space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    title={isCollapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-gray-100 text-primary-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            isActive
                              ? "text-primary-600"
                              : "text-gray-400 group-hover:text-primary-600"
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
                            isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[10rem] opacity-100 ml-3"
                          }`}
                        >
                          {item.name}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <NotificationBell isCollapsed={isCollapsed} />
      <SidebarUserMenu isCollapsed={isCollapsed} />
    </div>
  );
};

export default Sidebar;
