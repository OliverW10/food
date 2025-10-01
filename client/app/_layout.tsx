import "@/global.css";
import { SessionProvider } from "@/hooks/user-context";
import { fetchWithAuthRaw } from "@/services/fetch-with-auth";
import { flattedTransformer } from "@/services/flattedTransformer";
import trpc, { getTrpcServerUrl } from "@/services/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { Stack } from "expo-router";
import { createContext, useState } from "react";

export const UserContext = createContext(null);

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: flattedTransformer,
          url: getTrpcServerUrl(),
          async fetch(url, options) {
            let result = await fetchWithAuthRaw(url, options);
            return result;
          },
        }),
      ],
    })
  );
  // TODO: use "protected routes" https://docs.expo.dev/router/basics/common-navigation-patterns/#authenticated-users-only-protected-routes
  return (
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <Stack />
          </SessionProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}
