import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "../auth/AuthContext";
import { ToastProvider } from "../components/feedback/ToastProvider";
import { queryClient } from "./queryClient";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
