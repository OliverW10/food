import { useSession } from "@/hooks/user-context";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { ProfileButton } from "../../components/profile/profile-button";
import { StatBadge } from "../stat-badge";

type Props = {
  userId?: number;
  name?: string;
  email?: string;
  followers?: number;
  following?: number;
  postsCount?: number;
};

export function ProfileHeader({
  userId,
  name,
  email,
  followers = 0,
  following = 0,
  postsCount = 0,
}: Props) {
  const { user, signOut } = useSession();
  const router = useRouter();

  const myId = typeof user?.id === "string" ? Number(user.id) : user?.id ?? -1;
  const targetUserId = userId ?? myId;
  const isMe = targetUserId === myId;

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const handleLogout = () => {
    signOut();
    router.replace("/auth");
  };

  const goFollowers = () => {
    if (isMe) router.push("/followers");
    else router.push(`/followers?userId=${targetUserId}`);
  };

  const goFollowing = () => {
    if (isMe) router.push("/following");
    else router.push(`/following?userId=${targetUserId}`);
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <View
        style={{
          backgroundColor: "#111827",
          borderRadius: 14,
          padding: 14,
          borderWidth: 1,
          borderColor: "#1f2937",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#1f2937",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#374151",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
                {initials}
              </Text>
            </View>

            <View>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
                {name}
              </Text>
              {!!email && <Text style={{ color: "#9ca3af" }}>{email}</Text>}
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <ProfileButton
              variant="ghost"
              icon="person-add"
              label="Add"
              onPress={() => router.push("/search")}
            />
            <ProfileButton
              variant="ghost"
              icon="settings-outline"
              label="Settings"
              onPress={() => router.push("/settings")}
            />
            <ProfileButton
              variant="ghost"
              icon="enter"
              label="Log Out"
              onPress={handleLogout}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 14,
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor: "#1f2937",
          }}
        >
          <StatBadge label="Posts" value={postsCount} />
          <StatBadge label="Followers" value={followers} />
          <StatBadge label="Following" value={following} />
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
          <ProfileButton
            icon="people-outline"
            label={`Followers: ${followers}`}
            onPress={goFollowers}
            style={{ flex: 1 }}
          />
          <ProfileButton
            icon="person-outline"
            label={`Following: ${following}`}
            onPress={goFollowing}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      <Text style={{ color: "#d1d5db", fontSize: 14, fontWeight: "600" }}>
        Posts
      </Text>
    </View>
  );
}
