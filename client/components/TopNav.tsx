import { useSession } from "@/hooks/user-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

export function TopNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useSession();
  if (user === undefined || user === null) {
    console.log("no user on profile")
    router.navigate("/auth")
    return <></>
  }
  const username = user?.email.split("@")[0] ?? "Unknown";

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: "#0b0f16",
        }}
      >
        <Pressable onPress={() => setOpen(true)}>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            {username}&apos;s ▼
          </Text>
        </Pressable>

        <View style={{ flexDirection: "row", gap: 16 }}>
          <Pressable onPress={() => router.push("/search")}>
            <Ionicons name="search" size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={() =>{
            console.log(`Navigating to profile ${user.id}`)
            router.push(`/profile/${user.id}`)
          }}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Dropdown menu as modal */}
      <Modal visible={open} transparent animationType="fade">
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View
            style={{
              position: "absolute",
              top: 50,
              left: 12,
              right: 12,
              backgroundColor: "#1f2937",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <Pressable
              onPress={() => {
                router.push(`/profile/${user.id}`);
                setOpen(false);
              }}
            >
              <Text style={{ color: "#fff", padding: 8 }}>Profile</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/home");
                setOpen(false);
              }}
            >
              <Text style={{ color: "#fff", padding: 8 }}>Home</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/settings");
                setOpen(false);
              }}
            >
              <Text style={{ color: "#fff", padding: 8 }}>Settings</Text>
            </Pressable>
            <Pressable onPress={() => setOpen(false)}>
              <Text style={{ color: "#ef4444", padding: 8 }}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
