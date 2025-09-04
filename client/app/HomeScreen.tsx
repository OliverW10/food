import CornerButton from "@/components/corner-button";
import { FoodPost } from "@/components/FoodPost";
import { TopNav } from "@/components/TopNav";
import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function Home() {
  const { data: posts, isLoading: isPostsLoading } = trpc.post.getAll.useQuery();
  const { user } = useSession();

  const router = useRouter();
  
  if (isPostsLoading || !posts) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading feed…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <TopNav username={user?.email.split("@")[0] ?? "Unknown"} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <FoodPost review={item} />}
        contentContainerStyle={{ padding: 12 }}
      />
      <CornerButton isTop={false} onPress={() => router.push("/post")} >
        <Text style={{ color: "#999", fontSize: 24, lineHeight: 24 }}>+</Text>
      </CornerButton>
    </View>
  );
}
