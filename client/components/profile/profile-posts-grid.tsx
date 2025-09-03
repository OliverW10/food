// components/profile/ProfilePostsGrid.tsx
import { router } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import type { Review } from "../../lib/types";
import { FoodPost } from "../FoodPost";

type Props = {
  reviews: Review[];
  header?: React.ReactElement | null; // ← narrower than ReactNode
};

export function ProfilePostsGrid({ reviews, header }: Props) {
  return (
    <FlatList
      data={reviews}
      keyExtractor={(item) => item.id}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 16 }}
      ListHeaderComponent={header ?? null} // ← pass element (or null)
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
      renderItem={({ item }) => (
      <View style={{ width: "32%", marginBottom: 12 }}>
        <FoodPost
          review={item}
          variant="tile"
          showCaption
          onPress={() => router.push({ pathname: "/post", params: { id: item.id } })}
        />
      </View>
      )}
    />
  );
}
