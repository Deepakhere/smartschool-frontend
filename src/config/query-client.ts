import { QueryClient } from "@tanstack/react-query";

// One place for cache policy: data counts as fresh for 5 minutes and is kept 10 minutes after its last use.
// A request that failed because the network blinked or the server hiccupped is tried once more; a refusal
// (403), a missing record (404) or bad input (400) is not, since trying again cannot change the answer.
const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;

const isWorthRetrying = (error: unknown) => {
  const status = (error as { status?: number } | null)?.status;
  return !status || status >= 500;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
      gcTime: TEN_MINUTES,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => failureCount < 1 && isWorthRetrying(error),
    },
  },
});
