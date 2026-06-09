import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "../api/axiosClient";

function shouldRetryQuery(failureCount, error) {
  if (error instanceof ApiError && error.status === 429) {
    return failureCount < 3;
  }

  return failureCount < 1;
}

function retryDelay(attemptIndex, error) {
  if (error instanceof ApiError && error.status === 429) {
    return Math.min(1000 * 2 ** attemptIndex, 8000);
  }

  return 500;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: shouldRetryQuery,
      retryDelay,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 429) {
          return failureCount < 2;
        }

        return false;
      },
      retryDelay,
    },
  },
});
