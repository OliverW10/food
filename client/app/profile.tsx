import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Post } from "../../server/src/generated/prisma";
import { ProfileHeader } from "../components/profile/profile-header";
import { ProfilePostsGrid } from "../components/profile/profile-posts-grid";
import { ProfileTopBar } from "../components/profile/profile-top-bar";

export default function ProfilePage() {
  const router = useRouter();
  const { user, session } = useSession();

  // Redirect if not authed
  if (!session) {
    router.replace("/AuthScreen");
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Redirecting…</Text>
      </SafeAreaView>
    );
  }

  const userId = useMemo(() => {
    const raw = user?.id as number | string | undefined;
    if (typeof raw === "number") return raw;
    if (typeof raw === "string") {
      const n = Number(raw);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  }, [user?.id]);

 const input =
  userId != null
    ? { id: userId }
    : user?.email
    ? { email: user.email }
    : undefined;

const { data: profile, isLoading, isFetching } =
  trpc.profile.get.useQuery(input!, {
    enabled: !!session && !!input,
    staleTime: 60_000,
  });


  const displayName = profile?.name ?? "User";
  const displayEmail = profile?.email ?? user?.email ?? "";
  const followers = profile?.followers ?? 0;
  const following = profile?.following ?? 0;
  const userPosts: Post[] = (profile?.posts ?? []).map((post: any) => ({
    id: post.id,
    title: post.title,
    description: post.description ?? "",
    authorId: post.authorId ?? 0,
    foodId: post.foodId ?? null,
    imageId: post.imageId ?? null,
    createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
    published: post.published ?? false,
  }));
  const postsCount = userPosts.length;

  const handleLogout = async () => {
    router.replace("/AuthScreen");
  };

  if (isLoading || isFetching) {
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
