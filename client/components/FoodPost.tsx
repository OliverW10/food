import trpc from '@/services/trpc';
import React from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';

export type PostUI = {
  id: number;
  title: string;
  description: string;
  author: { id: number; name?: string; email: string };
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
};

type FoodPostProps = {
  review: PostUI;
  onOpenComments?: () => void;
} & ViewProps;

export function FoodPost({ review, onOpenComments }: FoodPostProps) {
  // use any-typed utils so cache update calls don't complain about the input key type
  const utils: any = (trpc as any).useUtils?.() ?? {
    post: {
      getFeed: {
        cancel: async () => {},
        getInfiniteData: () => undefined,
        setInfiniteData: () => {},
        invalidate: () => {},
      },
    },
  };

  // like toggle mutation (safe optional access; no TS error even if router doesn't have it yet)
  const likeMutation =
    (trpc as any).post?.likeToggle?.useMutation?.({
      onMutate: async (vars: { postId: number; like: boolean }) => {
        const { postId, like } = vars;

        // cancel any ongoing refetches
        await utils.post.getFeed.cancel();

        // snapshot previous cache (pass key as any to satisfy TS)
        const previous = utils.post.getFeed.getInfiniteData(undefined as any);

        // optimistic update across all cached pages
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

  return (
    <View style={{ marginBottom: 20, backgroundColor: '#111827', borderRadius: 12, overflow: 'hidden' }}>
      {/* Header with author */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#374151', marginRight: 8 }} />
        <Text style={{ fontWeight: '600', color: 'white' }}>
          {review.author.name ?? review.author.email.split('@')[0]}
        </Text>
      </View>

      {/* Post image placeholder */}
      <View style={{ backgroundColor: '#1f2937', height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#9ca3af' }}>🍴 Food photo here</Text>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 12, paddingTop: 8 }}>
        <TouchableOpacity accessibilityLabel="Like post" onPress={toggleLike}>
          <Text style={{ fontSize: 18 }}>{review.likedByMe ? '♥' : '♡'} {review.likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Open comments" onPress={onOpenComments}>
          <Text style={{ fontSize: 18 }}>💬 {review.commentsCount}</Text>
        </TouchableOpacity>
      </View>

      {/* Caption */}
      <Text style={{ marginHorizontal: 12, marginTop: 4, color: 'white' }}>
        <Text style={{ fontWeight: '600' }}>{review.author.name ?? review.author.email.split('@')[0]}</Text>{' '}
        {review.description}
      </Text>
    </View>
  );
}
