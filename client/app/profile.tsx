import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ProfileHeader } from "../components/profile/profile-header";
import { ProfilePostsGrid } from "../components/profile/profile-posts-grid";
import { ProfileTopBar } from "../components/profile/profile-top-bar";
import { fetchMyFeed } from "../lib/api";
import type { FeedResponse } from "../lib/types";

export default function ProfilePage() {
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
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading profile…</Text>
      </View>
    );
  }

  if (!feed) return null;

  const name = feed.user?.name;
  const email = (feed.user as any)?.email ?? "";
  const followers = (feed.user as any)?.followers ?? 0;
  const following = (feed.user as any)?.following ?? 0;
  const postsCount = feed.reviews?.length ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <ProfileTopBar username={name} />
      <ProfilePostsGrid
        reviews={feed.reviews}
        header={
          <ProfileHeader
            name={name}
            email={email}
            followers={followers}
            following={following}
            postsCount={postsCount}
          />
        }
      />
    </View>
  );
}
