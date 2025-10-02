import trpc from "@/services/trpc";
import React from "react";
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";

export type PostUI = {
  id: number;
  title: string;
  description: string;
  author: { id: number; email: string };
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
};

type FoodPostProps = {
  review: PostUI;
  onOpenComments?: () => void;
} & ViewProps;

export function FoodPost({ review, onOpenComments }: FoodPostProps) {
  const utils = (trpc as any).useUtils?.() ?? {
    post: {
      getFeed: {
        cancel: () => {},
        getInfiniteData: () => undefined,
        setInfiniteData: () => {},
        invalidate: () => {},
      },
    },
  };

  const likeMutation = (trpc as any).post?.likeToggle?.useMutation?.({
    onMutate: async ({ postId, like }: { postId: number; like: boolean }) => {
      await utils.post.getFeed.cancel();
      const previous = utils.post.getFeed.getInfiniteData();
      utils.post.getFeed.setInfiniteData(undefined, (data: any) => {
        if (!data) return data;
        return {
          ...data,
          pages: data.pages.map((pg: any) => ({
            ...pg,
            items: pg.items.map((p: any) =>
              p.id === postId
                ? {
                    ...p,
                    likedByMe: like,
                    likesCount: p.likesCount + (like ? 1 : -1),
                  }
                : p
            ),
          })),
        };
      });
      return { previous };
    },
    onError: (_e: any, _v: any, ctx: any) => {
      if (ctx?.previous)
        utils.post.getFeed.setInfiniteData(undefined, ctx.previous);
    },
    onSettled: () => {
      utils.post.getFeed.invalidate();
    },
  }) ?? { mutate: () => {} };

  const toggleLike = () => {
    likeMutation.mutate({ postId: review.id, like: !review.likedByMe });
  };

  // Make the post square based on screen width and 2 columns
  const screenWidth = Dimensions.get("window").width;
  const size = (screenWidth - 36) / 2; // 12px padding on each side, 12px gap between

  return (
    <View
      style={{
        width: size,
        height: size,
        margin: 6,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#181e25",
      }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onOpenComments}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: review.imageUrl }}
          style={{ width: "100%", height: "80%", resizeMode: "cover" }}
        />
        <View style={{ padding: 8, flex: 1, justifyContent: "space-between" }}>
          <Text
            style={{ fontWeight: "700", color: "white", fontSize: 35 }}
            numberOfLines={1}
          >
            {review.title}
          </Text>
          <Text style={{ color: "#6b7280", fontSize: 18 }} numberOfLines={1}>
            {review.description}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 6,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              accessibilityLabel="Like post"
              onPress={toggleLike}
              style={{ marginRight: 8 }}
            >
              <Text style={{ color: review.likedByMe ? "#ef4444" : "#fff" }}>
                {review.likedByMe ? "♥" : "♡"} {review.likesCount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel="Open comments"
              onPress={onOpenComments}
            >
              <Text style={{ color: "#fff" }}>💬 {review.commentsCount}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
