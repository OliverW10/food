import React from "react";
import { FlatList, View } from "react-native";
import { FoodPost, PostUI } from "../FoodPost";

type Props = {
  reviews: PostUI[];
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
          <FoodPost review={item} />
        </View>
      )}
    />
  );
}
