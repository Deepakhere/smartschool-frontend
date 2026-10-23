import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";
import SidebarUserMenu from "../sidebar-user-menu";
import { useSidebarController } from "./sidebar-controller";
import SidebarEntry from "./sidebar-entry";
import { revealMotion } from "./sidebar-motion";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}

// two panels side by side: the main list, and More sliding in over it with a way back
const Sidebar = ({ isCollapsed, isMobileOpen }: SidebarProps) => {
  const c = useSidebarController();
  // one card at a time, and only while collapsed: hovers while expanded are ignored
  const [openHint, setOpenHint] = useState<string | null>(null);
  const entry = { isCollapsed, openHint, setOpenHint };
  const onMore = c.view === "more";

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
      <div className="relative flex-1 overflow-hidden">
        <div
          className={cn(
            "flex h-full w-[200%] transition-transform duration-200 ease-out motion-reduce:transition-none",
            onMore && "-translate-x-1/2"
          )}
        >
          <nav aria-label="Main menu" aria-hidden={onMore} className="h-full w-1/2 overflow-y-auto px-2 pb-4 pt-3">
            <div className="space-y-1">
              {c.main.map((item) => (
                <SidebarEntry key={item.href} {...entry} {...item} inactive={onMore} />
              ))}
            </div>
            {c.hasMore && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <SidebarEntry
                  {...entry}
                  name="More"
                  hint="Every other page"
                  icon={Squares2X2Icon}
                  onClick={c.openMore}
                  active={c.moreIsActive}
                  dot={c.moreNeedsAttention}
                  trailing={<ChevronRightIcon className="h-4 w-4" />}
                  inactive={onMore}
                />
              </div>
            )}
          </nav>

          <nav aria-label="More pages" aria-hidden={!onMore} className="h-full w-1/2 overflow-y-auto px-2 pb-4 pt-3">
            <div
              className={cn(
                "flex items-center gap-3 border-b border-gray-100 pb-3",
                isCollapsed ? "justify-center" : "px-1"
              )}
            >
              <button
                type="button"
                onClick={c.back}
                tabIndex={onMore ? undefined : -1}
                aria-label="Back to the main menu"
                title="Back to the main menu"
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <div
                className={cn(
                  "min-w-0 overflow-hidden whitespace-nowrap",
                  revealMotion(isCollapsed),
                  isCollapsed && "hidden"
                )}
              >
                <p className="text-sm font-semibold text-gray-900">More</p>
                <p className="text-xs text-gray-500">Every other page</p>
              </div>
            </div>

            {c.more.map((group, index) => (
              <section
                key={group.label}
                aria-label={group.label}
                className={cn("pt-3", index > 0 && "mt-3 border-t border-gray-100", isCollapsed && index > 0 && "mx-1")}
              >
                <p
                  className={cn(
                    "overflow-hidden whitespace-nowrap px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400",
                    revealMotion(isCollapsed),
                    isCollapsed ? "max-h-0 pb-0" : "max-h-6 pb-1.5"
                  )}
                >
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarEntry key={item.href} {...entry} {...item} inactive={!onMore} />
                  ))}
                </div>
              </section>
            ))}
          </nav>
        </div>
      </div>

      {c.bottom.length > 0 && (
        <nav aria-label="Settings" className="space-y-1 border-t border-gray-100 px-2 py-2">
          {c.bottom.map((item) => (
            <SidebarEntry key={item.href} {...entry} {...item} />
          ))}
        </nav>
      )}

      <SidebarUserMenu isCollapsed={isCollapsed} />
    </div>
  );
};

export default Sidebar;
