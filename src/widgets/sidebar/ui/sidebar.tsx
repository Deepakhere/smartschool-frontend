import { UserMenu } from "@/features/user-menu";
import { useIsDesktop } from "@/shared/lib/hooks";
import { useLayoutStore } from "@/shared/model/layout-store";
import { cn } from "@/shared/lib/utils";
import { PANEL_MOTION } from "@/shared/lib/sidebar-motion";
import { SidebarController, useSidebarController } from "../model/sidebar-controller";
import MobileMenu from "./mobile-menu";
import SidebarPanels from "./sidebar-panels";

// from 1024px the sidebar is always in view and can collapse to icons
const DesktopSidebar = ({ controller }: { controller: SidebarController }) => {
  const isCollapsed = useLayoutStore((state) => state.isCollapsed);

  return (
    <div
      className={cn(
        "app-shell-surface relative z-10 flex h-full shrink-0 flex-col border-r border-gray-200 bg-white transition-[width]",
        PANEL_MOTION,
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <SidebarPanels controller={controller} isCollapsed={isCollapsed} />
      <UserMenu variant="sidebar" />
    </div>
  );
};

// below it the menu is a drawer, so the page gets the whole width
const Sidebar = () => {
  const controller = useSidebarController();
  const isDesktop = useIsDesktop();

  return isDesktop ? <DesktopSidebar controller={controller} /> : <MobileMenu controller={controller} />;
};

export default Sidebar;
