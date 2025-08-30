import { Fab, FabIcon } from "@/components/ui/fab";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AddIcon } from "@/components/ui/icon";
import "@/global.css";
import trpc, { serverUrl } from "@/services/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { router, Stack } from "expo-router";
import { createContext, useState } from "react";

export const UserContext = createContext(null);

function getAuthCookie() {
  return "todo";
}
  
export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
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
  
  return <GluestackUIProvider mode="light">
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Stack />
        <Fab
          size="lg"
          placement="bottom right"
          isHovered={false}
          isDisabled={false}
          isPressed={false}
          onPress={() => {
            router.push("/post");
          }}
        >
          <FabIcon as={AddIcon} />
        </Fab>
      </QueryClientProvider>
    </trpc.Provider>
  </GluestackUIProvider>;
}
