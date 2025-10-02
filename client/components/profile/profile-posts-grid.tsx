import React from "react";
import { FlatList, View } from "react-native";
import type { Post } from "../../../server/src/generated/prisma";
import { FoodPost, PostUI } from "../FoodPost";

type PostWithImage = Post & { imageUrl: string | undefined };
type Props = {
  reviews: PostWithImage[];
  header?: React.ReactElement | null;
};

export function ProfilePostsGrid({ reviews, header }: Props) {
  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
      ListHeaderComponent={header ?? null}
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

function postToPostUi(post: PostWithImage): PostUI {
  return {
    author: { id: post.authorId, email: "todo", name: "todo" },
    commentsCount: -1,
    description: post.description,
    id: post.id,
    likedByMe: false,
    likesCount: -1,
    title: post.title,
    imageUrl: post.imageUrl
  };
}
