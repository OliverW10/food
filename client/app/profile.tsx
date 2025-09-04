import trpc from "@/services/trpc";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ProfileHeader } from "../components/profile/profile-header";
import { ProfilePostsGrid } from "../components/profile/profile-posts-grid";
import { ProfileTopBar } from "../components/profile/profile-top-bar";

export default function ProfilePage() {
  const { data: feed, isLoading: isPostsLoading } = trpc.post.getAll.useQuery();
  const { data: profile, isLoading: isProfileLoading } = trpc.profile.get.useQuery();

  if (isPostsLoading || isProfileLoading || !feed || !profile) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <ProfileTopBar username={profile.email} />
      <ProfilePostsGrid
        reviews={feed}
        header={
          <ProfileHeader
            name={profile.email.split("@")[0]}
            email={profile.email}
            followers={profile.followers}
            following={profile.following}
            postsCount={feed.length}
          />
        }
      />
    </View>
  );
}
