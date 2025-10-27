// Oliver
import { TopNav } from "@/components/TopNav";
import { VersionInfoComponent } from "@/components/version-info";
import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useSession();
  const [name, setName] = useState(user?.email ?? "");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch user profile data (including post count)
  const profileQuery = trpc.profile.get.useQuery(
    { id: Number(user?.id) },
    { enabled: !!user }
  );
  const updateNameMutation = trpc.auth.updateName?.useMutation?.();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth");
    }
    if (profileQuery.data?.name) {
      setName(profileQuery.data.name);
    }
  }, [user, isLoading, router, profileQuery.data?.name]);

  if (!user || profileQuery.isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const handleSaveName = async () => {
    console.log("saving");
    setSaving(true);
    setError("");
    try {
      await updateNameMutation.mutateAsync({ name });
      setEditMode(false);
      profileQuery.refetch();
    } catch (e: any) {
      if (
        typeof e?.message === "string" &&
        e.message.includes("Name is already taken")
      ) {
        setError("That name is already taken. Please choose another.");
      } else {
        setError("Invalid name. Name cannot be empty or too long.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNav />
      <View style={{ padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Account</Text>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 16 }}>ID: {user.id}</Text>
          <Text style={{ fontSize: 16 }}>Email: {user.email}</Text>
          <Text style={{ fontSize: 16 }}>
            Posts: {profileQuery.data?.posts?.length ?? 0}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 16 }}>Name:</Text>
            {editMode ? (
              <TextInput
                value={name}
                onChangeText={setName}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 6,
                  minWidth: 120,
                }}
                editable={!saving}
              />
            ) : (
              <Text style={{ fontSize: 16 }}>{name || "(none)"}</Text>
            )}
            <Button
              title={editMode ? "Save" : "Edit"}
              onPress={editMode ? handleSaveName : () => setEditMode(true)}
              disabled={saving}
            />
            {editMode && (
              <Button
                title="Cancel"
                onPress={() => {
                  setEditMode(false);
                  setName(profileQuery.data?.name ?? "");
                }}
              />
            )}
          </View>
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        </View>
      </View>
      <VersionInfoComponent />
    </SafeAreaView>
  );
}
