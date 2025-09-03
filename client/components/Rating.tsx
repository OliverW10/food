import React from "react";
import { Text, View } from "react-native";

export function Rating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {Array.from({ length: full }).map((_, i) => (
        <Text key={`f-${i}`} style={{ color: "#facc15" }}>★</Text>
      ))}
      {half ? <Text style={{ color: "#facc15" }}>☆</Text> : null}
      {Array.from({ length: empty }).map((_, i) => (
        <Text key={`e-${i}`} style={{ color: "#4b5563" }}>☆</Text>
      ))}
    </View>
  );
}
