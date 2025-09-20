import { getStorageStateAsync } from "@/hooks/use-storage-state";
import { setItemAsync } from "expo-secure-store";
import { serverUrl } from "./trpc";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await getStorageStateAsync('session');
    const refreshToken = await getStorageStateAsync('refreshToken');
    console.log("Fetching", endpoint, "with token", token ? 'yes' : 'no');

    let res = await fetch(`${serverUrl}/${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401 && refreshToken) {
        const refreshRes = await fetch(`${serverUrl}/auth.refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });
    
        if (refreshRes.ok) {
            const json = await refreshRes.json();
            const { accessToken: newAccessToken } = json.result.data;

            await setItemAsync('session', newAccessToken);

            res = await fetch(`${serverUrl}/${endpoint}`, {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } else {
            throw new Error('Session expired. log in again');
        }
    }

    return res;
}