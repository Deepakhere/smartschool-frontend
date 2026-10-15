// one easing for the whole sidebar: quick start, long soft landing
export const PANEL_MOTION = "transition-[width] duration-500 ease-glide";

// labels slide in just after the panel opens, and slip out quickly when it closes
export const revealMotion = (isCollapsed: boolean) =>
  `transition-[max-width,max-height,opacity,transform,margin,padding,width] ease-glide ${
    isCollapsed ? "-translate-x-3 opacity-0 duration-200" : "translate-x-0 opacity-100 duration-500 delay-100"
  }`;
