import "@/global.css";
import { SessionProvider, useSession } from "@/hooks/user-context";
import trpc, { serverUrl } from "@/services/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { Slot } from "expo-router";
import { createContext, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import superjson from "superjson";

export const UserContext = createContext(null);

function getAuthCookie() {
  return "todo";
}

function AppLayout() {
  const { session, isLoading } = useSession();
  // const router = useRoute();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

    return <Slot />;
}
  
export default function RootLayout() {
  console.log("Sever URL:", serverUrl);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: serverUrl,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: getAuthCookie(),
            };
          },
        }),
      ],
    }),
  );
  
  return <>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <Slot />
        </SessionProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </>;
}
