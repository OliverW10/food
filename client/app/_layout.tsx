import "@/global.css";
import { SessionProvider } from "@/hooks/user-context";
import { fetchWithAuth } from "@/services/fetch-with-auth";
import trpc, { trpcServerUrl } from "@/services/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { Stack } from "expo-router";
import { createContext, useState } from "react";
import superjson from "superjson";

export const UserContext = createContext(null);

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: trpcServerUrl,
          async fetch(url, options) {
            let result = await fetchWithAuth(url, options);
            return result;
          }
        }),
      ],
    }),
  );
  // TODO: use "protected routes" https://docs.expo.dev/router/basics/common-navigation-patterns/#authenticated-users-only-protected-routes
  return <>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <Stack />
        </SessionProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </>;
}
