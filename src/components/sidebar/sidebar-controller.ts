import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";

import { useCan, useCurrentRole } from "@/context/tenant-context";
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
}

type View = "main" | "more";

// a short menu shows everything; a long one keeps daily pages on show and puts the rest behind More
const fitMenu = (menu: SidebarMenu): SidebarMenu => {
  const extras = menu.more.flatMap((group) => group.pages);
  return menu.main.length + extras.length <= FLAT_MENU_LIMIT
    ? { ...menu, main: [...menu.main, ...extras], more: [] }
    : menu;
};

// accountant and staff menus are built from what they were granted, so they are split by count
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

  const granted: SidebarPage[] = SHARED_PAGES.filter((shared) => can(...shared.anyOf)).map((shared) => ({
    ...shared.nav,
    path: shared.path.replace("/*", ""),
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
  const menu = fitMenu(menuByRole[role]());

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

  // the panel follows the page: landing on a More page shows More, any other page shows the main list
  const [view, setView] = useState<View>(onMorePage ? "more" : "main");
  const [viewFor, setViewFor] = useState(pathname);
  if (viewFor !== pathname) {
    setViewFor(pathname);
    setView(onMorePage ? "more" : "main");
  }

  // on a desktop More opens on its first page; on a phone the drawer would close on navigating, so it only opens
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
