"use client";

import { QueryClientProvider, QueryClient, QueryCache } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // gcTime: 10 * 60 * 1000, // Data will be garbage collected after 10 minutes of being unused
            gcTime: Infinity
          }
        },
        queryCache: new QueryCache({
          onError: (error) => {
            toast("Error", {
              description: error?.message || "Unexpected error! Please try again.",
              className: "!bg-red-500 !text-white"
            });
          }
        })
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
