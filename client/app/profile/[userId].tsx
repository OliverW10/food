// app/profile/ProfileView.tsx
import type { PostUI } from "@/components/FoodPost";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfilePostsGrid } from "@/components/profile/profile-posts-grid";
import { ProfileTopBar } from "@/components/profile/profile-top-bar";
import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileView() {
  const targetUserId = Number.parseInt(useLocalSearchParams()?.userId?.toString() ?? "-1");
  if (targetUserId === -1){
    return <Text>Loading</Text>
  }
  return <ProfileViewInternal userId={targetUserId} />
}

export function ProfileViewInternal({ userId }: { userId: number }) {
  const router = useRouter();
  const { user, session, signOut } = useSession();

  const { data: profile, isLoading, isFetching, isError, error } =
    trpc.profile.get.useQuery({ id: userId }, {
      // enabled: !!session && !!userId,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    });

  const handleLogout = async () => {
    signOut();
    router.replace("/auth");
  };

  if (!session) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#0b0f16",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Please sign in…</Text>
      </SafeAreaView>
    );
  }
  if (isLoading || isFetching) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#0b0f16",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading profile…</Text>
      </SafeAreaView>
    );
  }
  if (isError) {
    return <Text style={{ color: "#fff" }}>{error instanceof Error ? error.message : "Error"}</Text>;
  }
  if (!profile) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#0b0f16",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>User does not exist.</Text>
      </SafeAreaView>
    );
  }

  const posts: PostUI[] = (profile?.posts ?? []).map((p) => ({
    id: p.id,
    title: p.title ?? "",
    description: p.description ?? "",
    author: {
      id: userId,
      email: profile?.email ?? "",
      name: profile?.name ?? (profile?.email ? profile.email.split("@")[0] : ""),
    },
    likesCount: p.likesCount ?? 0,
    likedByMe: p.likedByMe ?? false,
    commentsCount: p.commentsCount ?? 0,
    imageUrl: p.imageUrl,
  }));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <ProfileTopBar username={profile?.email ?? user?.email ?? ""} />
      <View style={{ flex: 1 }}>
        <ProfilePostsGrid
          reviews={posts}
          header={
            <ProfileHeader
              name={profile?.name ?? "User"}
              email={profile?.email ?? ""}
              followers={profile?.followers ?? 0}
              following={profile?.following ?? 0}
              postsCount={posts.length}
            />
          }
        />

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: 14,
            marginHorizontal: 12,
            padding: 12,
            backgroundColor: "#1f2937",
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
