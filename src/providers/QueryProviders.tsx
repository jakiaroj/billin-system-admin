"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NiceModal from "@ebay/nice-modal-react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { PropsWithChildren, useState } from "react";

export default function QueryProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NiceModal.Provider>
        {children}
        <ProgressBar height="3px" color="#35B56B" shallowRouting />
      </NiceModal.Provider>
    </QueryClientProvider>
  );
}
