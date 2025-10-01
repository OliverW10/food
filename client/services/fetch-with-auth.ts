import { getStorageStateAsync, setStorageItemAsync } from "@/hooks/use-storage-state";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { AppRouter } from "../../server/src/main";
import { serverUrl, trpcServerUrl } from "./trpc";

let authTrpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
          url: trpcServerUrl,
          transformer: superjson,
        }),
    ]
});

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    return fetchWithAuthRaw(`${serverUrl}/${endpoint}`, options)
}

export async function fetchWithAuthRaw(url: URL | RequestInfo, options: RequestInit = {}) {
    const token = await getStorageStateAsync('session');
    const refreshToken = await getStorageStateAsync('refreshToken');

    let res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 && refreshToken) {
        console.log("Access token expired, using refresh token to get a new one")
        const refreshRes = await authTrpc.auth.refresh.mutate({ refreshToken })
    
        await setStorageItemAsync('session', refreshRes.accessToken);

        res = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${refreshRes.accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    }

    return res;
}