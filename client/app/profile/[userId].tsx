// app/profile/ProfileView.tsx
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfilePostsGrid } from "@/components/profile/profile-posts-grid";
import { ProfileTopBar } from "@/components/profile/profile-top-bar";
import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import React, { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileView({ userId }: { userId?: number }) {
  const { user, session } = useSession();

  const input = useMemo(() => {
    if (userId != null) return { id: userId };
    const raw = user?.id;
    const authedId = typeof raw === "string" ? Number(raw) : raw;
    if (authedId != null) return { id: authedId };
    if (user?.email) return { email: user.email };
    return undefined;
  }, [userId, user?.id, user?.email]);

  const { data: profile, isLoading, isFetching, isError, error } =
    trpc.profile.get.useQuery((input ?? { id: -1 }) as any, {
      enabled: !!session && !!input && (input as any).id !== -1,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    });

  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Please sign in…</Text>
      </SafeAreaView>
    );
  }
  if (!input) {
    return <Text style={{ color: "#fff" }}>No profile to load.</Text>;
  }
  if (isLoading || isFetching) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading profile…</Text>
      </SafeAreaView>
    );
  }
  if (isError) {
    return <Text style={{ color: "#fff" }}>{error instanceof Error ? error.message : "Error"}</Text>;
  }

  const posts = (profile?.posts ?? []).map(p => ({
    ...p,
    createdAt: new Date(p.createdAt),
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
      </View>
    </SafeAreaView>
  );
}
