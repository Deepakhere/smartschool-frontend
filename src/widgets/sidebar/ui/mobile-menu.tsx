import { BrandLogo } from "@/features/theme";
import { useLayoutStore } from "@/shared/model/layout-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/kit/sheet";
import { SidebarController } from "../model/sidebar-controller";
import SidebarPanels from "./sidebar-panels";

// phones and tablets: the menu icon in the header opens every section and page in a drawer from the left
const MobileMenu = ({ controller }: { controller: SidebarController }) => {
  const isOpen = useLayoutStore((state) => state.isSidebarOpen);
  const closeSidebar = useLayoutStore((state) => state.closeSidebar);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeSidebar()}>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        // a link to the page already open doesn't change the route, so the drawer closes on any link
        onClick={(event) => event.target instanceof Element && event.target.closest("a") && closeSidebar()}
        className="w-72 max-w-[85vw] p-0"
      >
        <SheetHeader className="flex h-16 shrink-0 items-center py-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <BrandLogo className="h-7 w-auto" />
        </SheetHeader>
        <SidebarPanels controller={controller} isCollapsed={false} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
