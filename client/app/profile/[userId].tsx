import type { PostUI } from "@/components/FoodPost";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfilePostsGrid } from "@/components/profile/profile-posts-grid";
import { ProfileTopBar } from "@/components/profile/profile-top-bar";
import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileView() {
  // Extract username from the URL parameters
  let username = useLocalSearchParams()?.username;

  // Convert userId from string to number; default to -1 if not found
  const targetUserId = Number.parseInt(
    useLocalSearchParams()?.userId?.toString() ?? "-1"
  );

  // If no valid userId is found yet, show a temporary loading message
  if (targetUserId === -1) {
    return <Text>Loading</Text>;
  }

  return (
    <>
      {/* Dynamically set the screen title based on username */}
      <Stack.Screen
        options={{
          title: (username as string) || "Profile",
        }}
      />
      {/* Render the internal profile view once the userId is known */}
      <ProfileViewInternal userId={targetUserId} />
    </>
  );
}

export function ProfileViewInternal({ userId }: { userId: number }) {
  const router = useRouter();
  const { user, session, signOut } = useSession();

  // Fetch profile data for the given userId from the backend using TRPC
  const {
    data: profile,
    isLoading,
    isFetching,
    isError,
    error,
  } = trpc.profile.get.useQuery(
    { id: userId },
    {
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    }
  );

  // Handle user logout and redirect to the authentication screen
  const handleLogout = async () => {
    signOut();
    router.replace("/auth");
  };

  // If the user is not signed in, prompt them to log in
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

  // Show loading indicator while fetching profile data
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

  // Display error message if the query fails
  if (isError) {
    return (
      <Text style={{ color: "#fff" }}>
        {error instanceof Error ? error.message : "Error"}
      </Text>
    );
  }

  // Handle case where profile data is empty or user not found
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

  // Map backend post data into UI-friendly structure
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
      {/* Display top bar with username */}
      <ProfileTopBar username={profile?.email ?? user?.email ?? ""} />

      <View style={{ flex: 1 }}>
        {/* Display user's profile info and posts grid */}
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

        {/* Logout button */}
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