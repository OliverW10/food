import trpc from "@/services/trpc";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View, ViewProps } from "react-native";

export type PostUI = {
  id: number;
  title: string;
  description: string;
  author: { id: number; name: string; email: string };
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
};

type FoodPostProps = {
  review: PostUI;
  onOpenComments?: () => void;
} & ViewProps;

export function FoodPost({ review, onOpenComments }: FoodPostProps) {
  const router = useRouter();
  const utils: any = trpc.useUtils?.() ?? {
    post: {
      getFeed: {
        cancel: async () => {},
        getInfiniteData: () => undefined,
        setInfiniteData: () => {},
        invalidate: () => {},
      },
    },
  };

  const likeMutation =
    (trpc as any).post?.likeToggle?.useMutation?.({
      onMutate: async (vars: { postId: number; like: boolean }) => {
        const { postId, like } = vars;
        await utils.post.getFeed.cancel();
        const previous = utils.post.getFeed.getInfiniteData(undefined as any);

        utils.post.getFeed.setInfiniteData(undefined as any, (data: any) => {
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
      onError: (_err: unknown, _vars: unknown, ctx: any) => {
        if (ctx?.previous) {
          utils.post.getFeed.setInfiniteData(undefined as any, ctx.previous);
        }
      },
      onSettled: () => {
        utils.post.getFeed.invalidate();
      },
    }) ?? { mutate: (_: { postId: number; like: boolean }) => {} };

  const toggleLike = () => {
    likeMutation.mutate({ postId: review.id, like: !review.likedByMe });
  };

  // Author/profile helpers

  const authorDisplayName = review.author.name ?? review.author.email.split("@")[0];
  const goToAuthorProfile = () => router.push(`/profile/${review.author.id}`);

  return (
    <View style={{ marginBottom: 20, backgroundColor: '#111827', borderRadius: 12, overflow: 'hidden' }}>
      {/* Header with author */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`View ${authorDisplayName}'s profile`}
        onPress={goToAuthorProfile}
        style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}
      >
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#374151', marginRight: 8 }} />
        <Text style={{ fontWeight: '600', color: 'white' }}>
          {authorDisplayName}
        </Text>
      </TouchableOpacity>

      {/* Post image placeholder */}
      <View style={{ backgroundColor: '#1f2937', height: 200, justifyContent: 'center', alignItems: 'center' }}>
        
      </View>

      {/* Title */}
      <Text style={{ marginHorizontal: 12, marginTop: 8, fontSize: 18, fontWeight: '700', color: 'white' }}>
        {review.title}
      </Text>

      {/* Caption */}
      <Text style={{ marginHorizontal: 12, marginTop: 4, color: 'white' }}>
        <Text style={{ fontWeight: '600' }}>
          {authorDisplayName}
        </Text>{' '}
        {review.description}
      </Text>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 12 }}>
        <TouchableOpacity accessibilityLabel="Like post" onPress={toggleLike}>
          <Text style={{ fontSize: 18 }}>{review.likedByMe ? '♥' : '♡'} {review.likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Open comments" onPress={onOpenComments}>
          <Text style={{ fontSize: 18 }}>💬 {review.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
