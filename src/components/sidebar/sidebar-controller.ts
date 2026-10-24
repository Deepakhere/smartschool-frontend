import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";

import { useCan, useCurrentRole, useHasModule } from "@/context/tenant-context";
import { SHARED_PAGES } from "@/routes/shared-pages";
import { useGetAttention } from "./service/attention-service";
import {
  ADMIN_MENU,
  CALENDAR_PAGE,
  FLAT_MENU_LIMIT,
  MAIN_LIMIT,
  PARENT_MENU,
  SidebarGroup,
  SidebarMenu,
  SidebarPage,
  TEACHER_MENU,
} from "./sidebar-pages";

export interface SidebarItem {
  name: string;
  hint: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  current: boolean;
  count: number;
  // its module isn't in the school's package
  locked: boolean;
}

type View = "main" | "more";

// short menus show flat; long ones put extras behind More
const fitMenu = (menu: SidebarMenu): SidebarMenu => {
  const extras = menu.more.flatMap((group) => group.pages);
  return menu.main.length + extras.length <= FLAT_MENU_LIMIT
    ? { ...menu, main: [...menu.main, ...extras], more: [] }
    : menu;
};

// granted-page menus (accountant, staff) split by count
const splitPages = (pages: SidebarPage[]): SidebarMenu =>
  pages.length <= FLAT_MENU_LIMIT
    ? { main: pages, more: [], bottom: [] }
    : {
        main: pages.slice(0, MAIN_LIMIT),
        more: [{ label: "More pages", pages: pages.slice(MAIN_LIMIT) }],
        bottom: [],
      };

export const useSidebarController = () => {
  const { organizationId = "" } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // the role decides the menu; permissions add granted pages
  const role = useCurrentRole() ?? "admin";
  const can = useCan();
  const hasModule = useHasModule();

  const granted: SidebarPage[] = SHARED_PAGES.filter((shared) => can(...shared.anyOf)).map((shared) => ({
    ...shared.nav,
    path: shared.path.replace("/*", ""),
    module: shared.module,
  }));
  const menuByRole: Record<typeof role, () => SidebarMenu> = {
    admin: () => ADMIN_MENU,
    parent: () => PARENT_MENU,
    teacher: () => ({
      ...TEACHER_MENU,
      more: [...TEACHER_MENU.more, ...(granted.length ? [{ label: "School", pages: granted }] : [])],
    }),
    accountant: () => splitPages([...granted, CALENDAR_PAGE]),
    staff: () => splitPages([...granted, CALENDAR_PAGE]),
  };
  // parents never see a locked module; staff see it with a lock
  const isLocked = (page: SidebarPage) => !!page.module && !hasModule(page.module);
  const visible = (pages: SidebarPage[]) => (role === "parent" ? pages.filter((p) => !isLocked(p)) : pages);
  const chosen = menuByRole[role]();
  const menu = fitMenu({
    main: visible(chosen.main),
    more: chosen.more.map((g) => ({ ...g, pages: visible(g.pages) })).filter((g) => g.pages.length),
    bottom: visible(chosen.bottom),
  });

  const attention = useGetAttention(organizationId, role !== "parent").data;
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const toItem = (page: SidebarPage): SidebarItem => {
    const href = `/${organizationId}/${role}/${page.path}`;
    return {
      name: page.name,
      hint: page.hint,
      href,
      icon: page.icon,
      current: isCurrent(href),
      count: page.attention ? (attention?.[page.attention] ?? 0) : 0,
      locked: isLocked(page),
    };
  };

  const main = menu.main.map(toItem);
  const more: (Omit<SidebarGroup, "pages"> & { items: SidebarItem[] })[] = menu.more.map((group) => ({
    label: group.label,
    items: group.pages.map(toItem),
  }));
  const bottom = menu.bottom.map(toItem);
  const moreItems = more.flatMap((group) => group.items);
  const onMorePage = moreItems.some((item) => item.current);

  // the open panel follows the current page
  const [view, setView] = useState<View>(onMorePage ? "more" : "main");
  const [viewFor, setViewFor] = useState(pathname);
  if (viewFor !== pathname) {
    setViewFor(pathname);
    setView(onMorePage ? "more" : "main");
  }

  // desktop jumps to the first More page; the drawer only opens (navigating closes it)
  const openMore = () => {
    setView("more");
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop && !onMorePage && moreItems[0]) navigate(moreItems[0].href);
  };

  return {
    view,
    main,
    more,
    bottom,
    hasMore: moreItems.length > 0,
    moreIsActive: onMorePage,
    moreNeedsAttention: moreItems.some((item) => item.count > 0),
    openMore,
    back: () => setView("main"),
  };
};
