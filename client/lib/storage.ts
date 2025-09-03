import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const webStore = {
  async getItemAsync(key: string) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },
  async setItemAsync(key: string, value: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  },
  async deleteItemAsync(key: string) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};

export const Storage =
  Platform.OS === "web"
    ? (webStore as Pick<
        typeof SecureStore,
        "getItemAsync" | "setItemAsync" | "deleteItemAsync"
      >)
    : SecureStore;

// helpers
export async function setDevUserId(id: number) {
  await Storage.setItemAsync("dev_user_id", String(id));
}

export async function getDevUserId(): Promise<number | null> {
  const v = await Storage.getItemAsync("dev_user_id");
  return v ? Number(v) : null;
}

export async function clearDevUserId() {
  await Storage.deleteItemAsync("dev_user_id");
}
