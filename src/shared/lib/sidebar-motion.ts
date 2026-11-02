// one glide for the sidebar and everything inside it, in both directions: quick start, soft landing
export const PANEL_MOTION = "duration-[280ms] ease-glide";

// the panel's own width, and the header's brand segment above it, move together
export const panelWidth = `transition-[width] ${PANEL_MOTION}`;

// labels fade while the panel's width does the real work (see index.css), so nothing waits for anything else
export const revealMotion = (isCollapsed: boolean) =>
  isCollapsed ? "sidebar-reveal-out -translate-x-2 opacity-0" : "sidebar-reveal-in translate-x-0 opacity-100";
