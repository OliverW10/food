import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { FoodPost } from "../components/FoodPost";
import { TopNav } from "../components/TopNav";
import { fetchMyFeed } from "../lib/api";
import type { FeedResponse } from "../lib/types";

export default function Home() {
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyFeed().then((res) => {
      setFeed(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading feed…</Text>
      </View>
    );
  }

  if (!feed) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <TopNav username={feed.user.name} />
      <FlatList
        data={feed.reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FoodPost review={item} />}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}
