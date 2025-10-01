import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileHeader } from "../../components/profile/profile-header";
import { ProfilePostsGrid } from "../../components/profile/profile-posts-grid";
import { ProfileTopBar } from "../../components/profile/profile-top-bar";

export default function ProfilePage() {
  const targetUserId = Number.parseInt(useLocalSearchParams<'/profile/[userId]'>()?.userId?.toString() ?? "-1");
  if (targetUserId === -1){
    throw new Error("Invalid id")
  }
  const router = useRouter();
  const { user, session, signOut } = useSession();

  if (!session) {
    // router.replace("/auth");
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Redirecting…</Text>
      </SafeAreaView>
    );
  }

  const userId = user?.id as number | string | undefined;

  const { data: byUserPages, isLoading: isUserPostsLoading } =
    (trpc as any).post.getByUserId?.useInfiniteQuery
      ? (trpc as any).post.getByUserId.useInfiniteQuery(
          { userId, limit: 24, cursor: null },
          { getNextPageParam: (last: any) => last?.nextCursor ?? null }
        )
      : { data: null, isLoading: false };

  const userPosts = byUserPages?.pages?.flatMap((p: any) => p.items) ?? [];

  const isLoading = isUserPostsLoading;

  const displayEmail = user?.email ?? "";
  const displayName = "dn";

  const followers = 0;
  const following = 0;
  const postsCount = userPosts?.length ?? 0;

  const handleLogout = async () => {
    await signOut();  
    router.replace("/auth"); 
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading profile…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <ProfileTopBar username={displayEmail} />

      <View style={{ flex: 1 }}>
        <ProfilePostsGrid
          reviews={userPosts}
          header={
            <ProfileHeader
              name={displayName}
              email={displayEmail}
              followers={followers}
              following={following}
              postsCount={postsCount}
            />
          }
        />

        <TouchableOpacity
          onPress={handleLogout}
          style={{ marginTop: 14, marginHorizontal: 12, padding: 12, backgroundColor: "#1f2937", borderRadius: 10, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
