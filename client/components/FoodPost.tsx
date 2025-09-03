import React from "react";
import { Image, Text, View } from "react-native";
import type { Review } from "../lib/types";
import { Rating } from "./Rating";

export function FoodPost({ review }: { review: Review }) {
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
