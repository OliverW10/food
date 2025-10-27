// Olivia
import { CommentsSheet } from "@/components/CommentsSheet";
import { FoodPost } from "@/components/FoodPost";
import trpc from "@/services/trpc";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

export default function PostPage() {
  const { postId } = useLocalSearchParams();
  let id: number | null = null;
  if (typeof postId === "string") {
    id = Number(postId);
  } else if (Array.isArray(postId)) {
    id = Number(postId[0]);
  } else if (typeof postId === "number") {
    id = postId;
  }
  const [showComments, setShowComments] = useState(false);

  const { data, isLoading, isError, error } = trpc.post.getById.useQuery(
    { id: id ?? -1 },
    {
      enabled: !!id,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    }
  );

  if (!id || isNaN(id)) return <Text>Invalid post ID</Text>;
  if (isLoading) {
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
        <Text style={{ color: "#9ca3af", marginTop: 8 }}>Loading post…</Text>
      </SafeAreaView>
    );
  }
  if (isError || !data) {
    return (
      <Text style={{ color: "#fff" }}>
        {error instanceof Error ? error.message : "Post not found"}
      </Text>
    );
  }

  // Adapt server post to PostUI
  const post = {
    id: data.id,
    title: data.title ?? "",
    description: data.description ?? "",
    author: {
      id: data.author?.id ?? 0,
      name:
        data.author?.name ??
        (data.author?.email ? data.author.email.split("@")[0] : ""),
      email: data.author?.email ?? "",
    },
    likesCount: typeof data.likesCount === "number" ? data.likesCount : 0,
    likedByMe: typeof data.likedByMe === "boolean" ? data.likedByMe : false,
    commentsCount:
      typeof data.commentsCount === "number" ? data.commentsCount : 0,
    imageUrl: data.imageUrl,
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: post.title,
        }}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0b0f16" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <FoodPost
            review={post}
            onOpenComments={() => setShowComments(true)}
            style={{ width: "30%" }}
          />
        </View>
        <CommentsSheet
          postId={post.id}
          visible={showComments}
          onClose={() => setShowComments(false)}
        />
      </SafeAreaView>
    </>
  );
}
