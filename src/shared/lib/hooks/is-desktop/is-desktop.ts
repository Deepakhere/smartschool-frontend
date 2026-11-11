import useMediaQuery from "../media-query";

// matches Tailwind's `lg` breakpoint (1024px): from here up the sidebar is always in view, below it is a drawer
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

export default useIsDesktop;
