import { useSession } from "@/hooks/user-context";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Index() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        router.replace("/home");
      } else {
        router.replace("/auth");
      }
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </SafeAreaView>
    )
  }

  return null;
}