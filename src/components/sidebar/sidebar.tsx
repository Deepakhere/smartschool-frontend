import { NavLink } from "react-router-dom";

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
      } shrink-0 bg-white border-r border-gray-200 z-10 transition-[width] duration-200`}
    >
      <div className="flex flex-col h-full pb-4 overflow-y-auto">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex === 0 ? "pt-3" : "pt-4 mt-4 border-t border-gray-100"}>
            {section.label && !isCollapsed && (
              <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                      `group flex items-center ${
                        isCollapsed ? "justify-center px-2" : "px-3"
                      } py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-gray-100 text-indigo-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`${isCollapsed ? "" : "mr-3"} h-5 w-5 flex-shrink-0 ${
                            isActive
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-indigo-600"
                          }`}
                          aria-hidden="true"
                        />
                        {!isCollapsed && item.name}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
