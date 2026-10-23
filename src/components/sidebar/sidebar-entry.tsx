import { ComponentType, ReactNode, SVGProps } from "react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { panelMotion, revealMotion } from "./sidebar-motion";

interface SidebarEntryProps {
  name: string;
  hint: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isCollapsed: boolean;
  // a page link, or a button such as More and Back
  href?: string;
  onClick?: () => void;
  // a button's own active state; links work theirs out from the route
  active?: boolean;
  count?: number;
  // a small dot on the icon, e.g. More when a page behind it needs attention
  dot?: boolean;
  trailing?: ReactNode;
  // off-screen in the sliding panel, so it is skipped by the keyboard
  inactive?: boolean;
  openHint: string | null;
  setOpenHint: (name: string | null) => void;
}

const rowClass = (isCollapsed: boolean, active: boolean) =>
  cn(
    "group flex w-full items-center rounded-md py-2 pr-3 text-sm font-medium transition-[padding]",
    panelMotion(isCollapsed),
    isCollapsed ? "pl-[13.5px]" : "pl-3",
    active ? "bg-gray-100 text-primary-600" : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
  );

const SidebarEntry = ({
  name,
  hint,
  icon: Icon,
  isCollapsed,
  href,
  onClick,
  active = false,
  count = 0,
  dot = false,
  trailing,
  inactive = false,
  openHint,
  setOpenHint,
}: SidebarEntryProps) => {
  const body = (isActive: boolean) => (
    <>
      <span className="relative flex-shrink-0">
        <Icon
          className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-gray-400 group-hover:text-primary-600")}
          aria-hidden="true"
        />
        {(dot || (isCollapsed && count > 0)) && (
          <span
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
            aria-hidden="true"
          />
        )}
      </span>
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap text-left",
          revealMotion(isCollapsed),
          isCollapsed ? "ml-0 max-w-0" : "ml-3 max-w-[10rem]"
        )}
      >
        {name}
      </span>
      {!isCollapsed && count > 0 && (
        <span
          className="ml-auto rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600"
          aria-label={`${count} waiting`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
      {!isCollapsed && !count && trailing && <span className="ml-auto text-gray-400">{trailing}</span>}
    </>
  );

  return (
    <Tooltip
      open={isCollapsed && openHint === name}
      onOpenChange={(open) => setOpenHint(open && isCollapsed ? name : null)}
    >
      {/* plain wrapper: Slot breaks NavLink's className function */}
      <TooltipTrigger asChild>
        <div>
          {href ? (
            <NavLink
              to={href}
              tabIndex={inactive ? -1 : undefined}
              className={({ isActive }) => rowClass(isCollapsed, isActive)}
            >
              {({ isActive }) => body(isActive)}
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={onClick}
              tabIndex={inactive ? -1 : undefined}
              aria-current={active ? "true" : undefined}
              className={rowClass(isCollapsed, active)}
            >
              {body(active)}
            </button>
          )}
        </div>
      </TooltipTrigger>
      {/* name and a one-line hint, only while the sidebar is collapsed */}
      <TooltipContent side="right" sideOffset={14}>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="mt-0.5 text-gray-500">{hint}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SidebarEntry;
