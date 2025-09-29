import "@/global.css";
import { getStorageStateAsync } from "@/hooks/use-storage-state";
import { SessionProvider } from "@/hooks/user-context";
import trpc, { serverUrl, trpcServerUrl } from "@/services/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, retryLink } from "@trpc/client";
import * as Notifications from 'expo-notifications';
import { router, Slot } from "expo-router";
import { createContext, useEffect, useState } from "react";
import superjson from "superjson";

export const UserContext = createContext(null);

function getAuthCookie() {
  return "todo";
}

function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === 'string') {
        router.push(url as any);
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
  
export default function RootLayout() {
  console.log("Sever URL:", serverUrl);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: trpcServerUrl,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              Authorization: "Bearer: " + ((await getStorageStateAsync("session")) ?? ""),
            };
          },
        }),
        retryLink({
          retry: (opts) => {
            console.log("retry");
            return true;
          },
        })
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
