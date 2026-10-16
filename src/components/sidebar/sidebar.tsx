import { useState } from "react";
import { NavLink } from "react-router-dom";

import SidebarUserMenu from "../sidebar-user-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useSidebarController } from "./sidebar-controller";
import { panelMotion, revealMotion } from "./sidebar-motion";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}

const Sidebar = ({ isCollapsed, isMobileOpen }: SidebarProps) => {
  const { sections } = useSidebarController();
  // one card at a time, and only while collapsed: hovers while expanded are ignored
  const [openHint, setOpenHint] = useState<string | null>(null);

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-350 ease-glide
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:z-10 lg:translate-x-0 lg:transition-[width] ${isCollapsed ? "lg:duration-400 lg:ease-settle" : "lg:duration-350 lg:ease-glide"}
        ${isCollapsed ? "lg:w-16" : "lg:w-56"}
        app-shell-surface bg-white border-r border-gray-200 shrink-0 flex flex-col h-full
      `}
    >
      <div className="flex-1 overflow-y-auto pb-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex === 0 ? "pt-3" : "pt-4 mt-4 border-t border-gray-100"}>
            {section.label && (
              <p
                className={`px-5 overflow-hidden whitespace-nowrap text-xs font-semibold text-gray-400 uppercase tracking-wider ${revealMotion(isCollapsed)} ${
                  isCollapsed ? "max-h-0 pb-0" : "max-h-6 pb-2"
                }`}
              >
                {section.label}
              </p>
            )}
            <nav className="px-2 space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Tooltip
                    key={item.name}
                    open={isCollapsed && openHint === item.name}
                    onOpenChange={(open) => setOpenHint(open && isCollapsed ? item.name : null)}
                  >
                    {/* a plain wrapper as the trigger: Slot would mangle NavLink's className function */}
                    <TooltipTrigger asChild>
                      <div>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            `group flex items-center py-2 pr-3 text-sm font-medium rounded-md transition-[padding] ${panelMotion(isCollapsed)} ${isCollapsed ? "pl-[13.5px]" : "pl-3"} ${
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
                                className={`overflow-hidden whitespace-nowrap ${revealMotion(isCollapsed)} ${
                                  isCollapsed ? "max-w-0 ml-0" : "max-w-[10rem] ml-3"
                                }`}
                              >
                                {item.name}
                              </span>
                            </>
                          )}
                        </NavLink>
                      </div>
                    </TooltipTrigger>
                    {/* name and a one-line hint, only while the sidebar is collapsed */}
                    <TooltipContent side="right" sideOffset={14}>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="mt-0.5 text-gray-500">{item.hint}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <SidebarUserMenu isCollapsed={isCollapsed} />
    </div>
  );
};

export default Sidebar;
