import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,   // 5 minutes before data is considered stale
        gcTime: 10 * 60 * 1000,     // 10 minutes before unused data is garbage collected
        retry: 1,                    // Only retry once on failure (not 3 times)
        refetchOnWindowFocus: false, // Don't refetch when user returns to tab
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
