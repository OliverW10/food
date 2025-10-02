import { TopNav } from "@/components/TopNav";
import { VersionInfoComponent } from "@/components/version-info";
import { useSession } from "@/hooks/user-context";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth");
    }
  }, [user, isLoading, router]);

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNav />
      <Text>Settings</Text>
      <VersionInfoComponent />
    </SafeAreaView>
  );
}
