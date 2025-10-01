import {
  getStorageStateAsync,
  setStorageItemAsync,
} from "@/hooks/use-storage-state";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../server/src/main";
import { flattedTransformer } from "./flattedTransformer";
import { getTrpcServerUrl } from "./trpc";

const trpcServerUrl = getTrpcServerUrl();

if (!trpcServerUrl) {
  throw new Error("trpcServerUrl is undefined");
}

let authTrpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: trpcServerUrl,
      transformer: flattedTransformer,
    }),
  ],
});

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  return fetchWithAuthRaw(`${trpcServerUrl}/${endpoint}`, options);
}

export async function fetchWithAuthRaw(
  url: URL | RequestInfo,
  options: RequestInit = {}
) {
  const token = await getStorageStateAsync("session");
  const refreshToken = await getStorageStateAsync("refreshToken");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 && refreshToken) {
    console.log("Access token expired, using refresh token to get a new one");
    const refreshRes = await authTrpc.auth.refresh.mutate({ refreshToken });

    await setStorageItemAsync("session", refreshRes.accessToken);

    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${refreshRes.accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  return res;
}
