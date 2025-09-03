import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { Review } from "../lib/types";
import { Rating } from "./Rating";

type Props = {
  review: Review;
  variant?: "card" | "tile";
  onPress?: () => void;
  showCaption?: boolean; 
};

export function FoodPost({ review, variant = "card", onPress, showCaption = false }: Props) {
  if (variant === "tile") {
    return (
      <View>
        <Pressable
          onPress={onPress}
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 10,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#1f2937",
            backgroundColor: "#111827",
          }}
        >
          {review.imageUrl ? (
            <Image source={{ uri: review.imageUrl }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#9ca3af", paddingHorizontal: 6 }} numberOfLines={2}>
                {review.dish}
              </Text>
            </View>
          )}
        </Pressable>

        {showCaption && (
          <Text style={{ color: "#9ca3af", marginTop: 6 }} numberOfLines={1}>
            {review.dish} @ {review.restaurant}
          </Text>
        )}
      </View>
    );
  }
  
  return (
    <View
      style={{
        marginBottom: 20,
        backgroundColor: "#111827",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {review.imageUrl && (
        <Image source={{ uri: review.imageUrl }} style={{ width: "100%", height: 200 }} />
      )}
      <View style={{ padding: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          {review.dish} @ {review.restaurant}
        </Text>
        <Rating value={review.rating} />
        {review.comment && (
          <Text style={{ color: "#d1d5db", marginTop: 6 }}>{review.comment}</Text>
        )}
        <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
          {new Date(review.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}
