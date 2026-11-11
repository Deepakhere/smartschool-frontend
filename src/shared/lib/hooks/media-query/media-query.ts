import { useSyncExternalStore } from "react";

// true while the viewport matches a CSS media query, e.g. "(min-width: 1024px)"
export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches
  );

export default useMediaQuery;
