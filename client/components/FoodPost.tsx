import trpc from '@/services/trpc';
import React from 'react';
import { Text, TouchableOpacity, View, ViewProps } from 'react-native';

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

export function FoodPost({
  review,
  onOpenComments,
}: FoodPostProps ) {
  const utils = (trpc as any).useUtils?.() ?? {
    post: { getFeed: { cancel: () => {}, getInfiniteData: () => undefined, setInfiniteData: () => {}, invalidate: () => {} } }
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
                ? { ...p, likedByMe: like, likesCount: p.likesCount + (like ? 1 : -1) }
                : p
            ),
          })),
        };
      });
      return { previous };
    },
    onError: (_e: any, _v: any, ctx: any) => {
      if (ctx?.previous) utils.post.getFeed.setInfiniteData(undefined, ctx.previous);
    },
    onSettled: () => {
      utils.post.getFeed.invalidate();
    },
  }) ?? { mutate: () => {} };

  const toggleLike = () => {
    likeMutation.mutate({ postId: review.id, like: !review.likedByMe });
  };

  return (
    <View style={{ padding:12, borderBottomWidth:1, borderColor:'#eee' }}>
      <Text style={{ fontWeight:'700', color: 'white' }}>{review.title}</Text>
      <Text style={{ color:'#6b7280', marginTop:4 }}>{review.description}</Text>

      <View style={{ flexDirection:'row', gap:16, marginTop:10 }}>
        <TouchableOpacity accessibilityLabel="Like post" onPress={toggleLike}>
          <Text>{review.likedByMe ? '♥' : '♡'} {review.likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity accessibilityLabel="Open comments" onPress={onOpenComments}>
          <Text>💬 {review.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
