import { getItemAsync, setItemAsync } from "expo-secure-store";

const API_URL = 'http://localhost:3000/trpc';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await getItemAsync('session');
    const refreshToken = await getItemAsync('refreshToken');
    console.log("Fetching", endpoint, "with token", token ? 'yes' : 'no');

    let res = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (res.status === 401 && refreshToken) {
        const refreshRes = await fetch(`${API_URL}/auth.refresh`, {
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

            res = await fetch(`${API_URL}/${endpoint}`, {
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