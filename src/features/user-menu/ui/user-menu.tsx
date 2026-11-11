import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

import Avatar from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/kit/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/kit/popover";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/shared/ui/kit/sheet";
import { revealMotion } from "@/shared/lib/sidebar-motion";
import { useUserMenuController } from "../model/user-menu-controller";
import UserMenuBody from "./user-menu-body";

interface UserMenuProps {
  // "sidebar": the card at the foot of the desktop sidebar, opening a popover; "header": the avatar in the header
  // on phones and tablets, opening a half-height sheet from the bottom
  variant: "sidebar" | "header";
}

const UserMenu = ({ variant }: UserMenuProps) => {
  const { isCollapsed, user, role, ...rest } = useUserMenuController();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { pathname } = useLocation();

  // a link inside the sheet moves to another page
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  if (!user?.name) return null;

  if (variant === "header") {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full p-0" aria-label={user.name}>
            <Avatar name={user.name} src={user.avatar?.url} size={32} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          aria-describedby={undefined}
          className="h-[50dvh] max-h-[50dvh] overflow-y-auto p-2"
        >
          <SheetTitle className="sr-only">{user.name}</SheetTitle>
          <UserMenuBody user={user} role={role} {...rest} />
        </SheetContent>
      </Sheet>
    );
  }

  const trigger = (
    <button
      type="button"
      className="group flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-2 py-2 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
    >
      <span className="flex items-center min-w-0 -ml-0.5">
        <Avatar name={user.name} src={user.avatar?.url} size={32} />
        <span
          className={`min-w-0 overflow-hidden text-left ${revealMotion(isCollapsed)} ${
            isCollapsed ? "max-w-0 ml-0" : "max-w-[9rem] ml-2.5"
          }`}
        >
          <span className="block truncate text-sm font-medium text-gray-900">{user.name}</span>
          <span className="block truncate text-xs text-gray-500 capitalize">{role}</span>
        </span>
      </span>
      <ChevronUpDownIcon
        className={`text-gray-400 shrink-0 overflow-hidden ${revealMotion(isCollapsed)} ${
          isCollapsed ? "h-4 w-0" : "h-4 w-4"
        }`}
        aria-hidden="true"
      />
    </button>
  );

  return (
    <div className="border-t border-gray-100 p-2">
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent side="top" align={isCollapsed ? "center" : "start"}>
          <UserMenuBody user={user} role={role} {...rest} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserMenu;
