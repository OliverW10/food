import React from "react";
import { Text, View } from "react-native";

export function StatBadge({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={{ alignItems: "center", minWidth: 72 }}>
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>{value}</Text>
      <Text style={{ color: "#9ca3af", fontSize: 12 }}>{label}</Text>
    </View>
  );
}
