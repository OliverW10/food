import { FoodPost } from "@/components/FoodPost";
import { TopNav } from "@/components/TopNav";
import trpc from "@/services/trpc";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function Home() {
  const { data: posts, isLoading: isPostsLoading } = trpc.post.getAll.useQuery();
  const { data: profile, isLoading: isProfileLoading } = trpc.profile.get.useQuery();
  if (isPostsLoading || isProfileLoading || !posts || !profile) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading feed…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <TopNav username={profile.email} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <FoodPost review={item} />}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}
