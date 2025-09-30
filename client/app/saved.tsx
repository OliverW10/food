import { TopNav } from "@/components/TopNav";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SavedPage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNav />
      <Text>Saved</Text>
    </SafeAreaView>
  );
}
