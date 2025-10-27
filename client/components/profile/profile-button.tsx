// Josh
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextStyle, ViewStyle } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "ghost";
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function ProfileButton({
  label,
  onPress,
  icon,
  variant = "primary",
  style,
  textStyle,
}: Props) {
  const bg = variant === "primary" ? "#1f2937" : "transparent";
  const border = variant === "primary" ? "transparent" : "#374151";
  const color = "#fff";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={16} color={color} /> : null}
      <Text style={[{ color, fontWeight: "600" }, textStyle]}>{label}</Text>
    </Pressable>
  );
}
