// Josh
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export function ProfileTopBar({ username }: { username?: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#111827",
      }}
    >
      <Pressable
        onPress={() => router.push("/")}
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <Ionicons name="home" size={22} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Home
        </Text>
      </Pressable>
      {!!username && (
        <Text
          style={{ marginLeft: "auto", color: "#9ca3af", fontSize: 14 }}
          numberOfLines={1}
        >
          {username}
        </Text>
      )}
    </View>
  );
}
