import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import { cn } from "@/shared/lib/utils";
import { PANEL_MOTION, revealMotion } from "@/shared/lib/sidebar-motion";
import { SidebarController, SidebarSection } from "../model/sidebar-controller";
import SidebarEntry from "./sidebar-entry";

interface SidebarPanelsProps {
  controller: SidebarController;
  isCollapsed: boolean;
}

// the main list and one section's panel, sliding side by side; the desktop sidebar and the mobile drawer both show it
const SidebarPanels = ({ controller: c, isCollapsed }: SidebarPanelsProps) => {
  // one card at a time, and only while collapsed: hovers while expanded are ignored
  const [openHint, setOpenHint] = useState<string | null>(null);
  const entry = { isCollapsed, openHint, setOpenHint };
  const isOpen = !!c.openSection;
  // the panel keeps its section while it slides away
  const lastSection = useRef<SidebarSection | null>(null);
  if (c.openSection) lastSection.current = c.openSection;
  const panel = c.openSection ?? lastSection.current;

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        className={cn(
          "flex h-full w-[200%] transition-transform duration-[280ms] ease-glide motion-reduce:transition-none",
          isOpen && "-translate-x-1/2"
        )}
      >
        <nav
          aria-label="Main menu"
          aria-hidden={isOpen}
          className={cn(
            "h-full w-1/2 space-y-1 overflow-y-auto overflow-x-hidden px-2 pb-4 pt-3",
            "transition-opacity duration-200 ease-out motion-reduce:transition-none",
            isOpen && "opacity-0"
          )}
        >
          {c.main.map((item) =>
            item.kind === "divider" ? (
              <div key={item.key} className="!my-3 border-t border-gray-100" aria-hidden="true" />
            ) : item.kind === "page" ? (
              <SidebarEntry key={item.item.href} {...entry} {...item.item} inactive={isOpen} />
            ) : (
              <SidebarEntry
                key={item.section.label}
                {...entry}
                name={item.section.label}
                hint={item.section.hint}
                icon={item.section.icon}
                onClick={() => c.open(item.section)}
                active={item.section.current}
                dot={item.section.needsAttention}
                trailing={<ChevronRightIcon className="h-4 w-4" />}
                inactive={isOpen}
              />
            )
          )}
        </nav>

        <nav
          aria-label={panel?.label ?? "Section"}
          aria-hidden={!isOpen}
          className={cn(
            "h-full w-1/2 overflow-y-auto overflow-x-hidden px-2 pb-4 pt-3",
            "transition-opacity duration-200 ease-out motion-reduce:transition-none",
            !isOpen && "opacity-0"
          )}
        >
          <div
            className={cn(
              "flex items-center border-b border-gray-100 pb-3 transition-[gap,padding]",
              PANEL_MOTION,
              isCollapsed ? "gap-0 px-2" : "gap-3 px-1"
            )}
          >
            <button
              type="button"
              onClick={c.back}
              tabIndex={isOpen ? undefined : -1}
              aria-label="Back to the main menu"
              title="Back to the main menu"
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <div
              className={cn(
                "min-w-0 flex-1 overflow-hidden whitespace-nowrap",
                revealMotion(isCollapsed),
                isCollapsed ? "max-w-0" : "max-w-[11rem]"
              )}
            >
              <p className="truncate text-sm font-semibold text-gray-900">{panel?.label}</p>
              <p className="truncate text-xs text-gray-500">{panel?.hint}</p>
            </div>
          </div>

          <div className="space-y-1 pt-3">
            {panel?.items.map((item) => (
              <SidebarEntry key={item.href} {...entry} {...item} inactive={!isOpen} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SidebarPanels;
