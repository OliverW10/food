import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Post } from "../../server/src/generated/prisma";

const pastaImage = require("../assets/images/pasta.png");

type Props = {
  review: Post;
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
            <Image source={pastaImage} style={{ width: "100%", height: "100%" }} />
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#9ca3af", paddingHorizontal: 6 }} numberOfLines={2}>
                {review.title}
              </Text>
            </View>
        </Pressable>

        {showCaption && (
          <Text style={{ color: "#9ca3af", marginTop: 6 }} numberOfLines={1}>
            {review.description}
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
      <Image source={pastaImage} style={{ width: "100%", height: 200 }} />
      <View style={{ padding: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          {review.title}
        </Text>
        {/* <Rating value={review.} /> */}
        {review.description && (
          <Text style={{ color: "#d1d5db", marginTop: 6 }}>{review.description}</Text>
        )}
        <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
          {new Date(review.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}
