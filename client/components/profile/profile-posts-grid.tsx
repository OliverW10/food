import React from "react";
import { FlatList, View } from "react-native";
import type { Post } from "../../../server/src/generated/prisma";
import { FoodPost, PostUI } from "../FoodPost";

type Props = {
  reviews: Post[];
  header?: React.ReactElement | null; // ← narrower than ReactNode
};

export function ProfilePostsGrid({ reviews, header }: Props) {
  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
      ListHeaderComponent={header ?? null} // ← pass element (or null)
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
      renderItem={({ item }) => (
      <View style={{ width: "32%", marginBottom: 12 }}>
        <FoodPost
          review={postToPostUi(item)}
          // onPress={() => router.push(`/post/${item.id ?? -1}`)}
        />
      </View>
      )}
    />
  );
}

function postToPostUi(post: Post): PostUI{
  return {
    author: { id: post.authorId, email: "todo" }, // TODO: lookup author
    commentsCount: -1,
    description: post.description,
    id: post.id,
    likedByMe: false,
    likesCount: -1,
    title: post.title,
  }
}