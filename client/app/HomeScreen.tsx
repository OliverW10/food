import { FoodPost } from "@/components/FoodPost";
import { TopNav } from "@/components/TopNav";
import { AuthContext } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import React, { useContext } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function Home() {
  const { data: posts, isLoading: isPostsLoading } = trpc.post.getAll.useQuery();
  const { user } = useContext(AuthContext);
  if (isPostsLoading || !posts) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading feed…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <TopNav username={user?.email.split("@")[0] ?? "Unknown"} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <FoodPost review={item} />}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}
