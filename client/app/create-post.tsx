import PostImagePicker from "@/components/PostImagePicker";
import { TopNav } from "@/components/TopNav";
import { SimplePreset, TypeSelect } from "@/components/type-select";
import { getStorageStateAsync } from "@/hooks/use-storage-state";
import { useSession } from "@/hooks/user-context";
import trpc from "@/services/trpc";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostPage() {
  const { user } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [didCook, setDidCook] = useState(true);
  const [touched, setTouched] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [remoteImageUri, setRemoteImageUri] = useState<string | null>(null);
  const [loadingRemote, setLoadingRemote] = useState(false);

  const createPostMutation = trpc.post.create.useMutation();

  const setTitleAndPreset = (val: string) => {
    setTitle(val);
  };

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = async () => {
    setTouched(true);
    if (!user) {
      Alert.alert("Not signed in", "Please log in first.");
      return;
    }
    if (!isValid) return;

    try {
      const imageId = await uploadImage();
      if (!imageId) {
        Alert.alert("Error", "Failed to upload image");
        return;
      }

      const created = await createPostMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        authorId: parseInt(user.id, 10),
        imageId,
      });

      if (created?.image?.storageUrl) {
        setLoadingRemote(true);
        setRemoteImageUri("http://localhost:3000" + created.image.storageUrl);
        setLoadingRemote(false);
        setImageUri(null);
        setRemoteImageUri(null);
      }

      setTitle("");
      setDescription("");
      Alert.alert("Posted!", "Your post was created.", [
        { text: "View Feed", onPress: () => router.replace("/") },
        { text: "Stay Here" },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to create post");
    }
  };

  const uploadImage = async (): Promise<number | null> => {
    if (!imageUri) return null;

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "image.jpg");

      const token = await getStorageStateAsync("session");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const uploadResponse = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
        headers,
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload image");

      const { id } = await uploadResponse.json();
      return id;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const presets: SimplePreset[] = [
    { label: "Homemade ramen", value: "Homemade ramen" },
    { label: "Spaghetti Bolognese", value: "Spaghetti Bolognese" },
    { label: "Chicken Curry", value: "Chicken Curry" },
    { label: "Vegan Buddha Bowl", value: "Vegan Buddha Bowl" },
    { label: "Avocado Toast", value: "Avocado Toast" },
    { label: "Grilled Salmon", value: "Grilled Salmon" },
    { label: "Beef Tacos", value: "Beef Tacos" },
    { label: "Sushi Platter", value: "Sushi Platter" },
    { label: "Margherita Pizza", value: "Margherita Pizza" },
    { label: "Chocolate Lava Cake", value: "Chocolate Lava Cake" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f16" }}>
      <TopNav />
      <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#fff" }}>
            Create Post
          </Text>

          <View style={{ marginBottom: 18, zIndex: 10 }}>
            <Text style={{ fontWeight: "600", marginBottom: 6, color: "#e5e7eb" }}>Title</Text>
            <TypeSelect
              value={title}
              onChange={setTitleAndPreset}
              presets={presets}
              placeholder="E.g. Homemade ramen"
            />
            {touched && title.trim().length === 0 && (
              <Text style={{ color: "#f87171", marginTop: 4 }}>Title is required.</Text>
            )}
          </View>

          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontWeight: "600", marginBottom: 6, color: "#e5e7eb" }}>
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder=""
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={5}
              style={{
                borderWidth: 1,
                borderColor: "#374151",
                padding: 12,
                borderRadius: 8,
                backgroundColor: "#111827",
                textAlignVertical: "top",
                minHeight: 120,
                color: "#e5e7eb",
              }}
              keyboardAppearance="dark"
              onBlur={() => setTouched(true)}
            />
            {touched && description.trim().length === 0 && (
              <Text style={{ color: "#f87171", marginTop: 4 }}>Description is required.</Text>
            )}
          </View>

          <View style={{ height: 1, backgroundColor: "#1f2937", marginVertical: 20 }} />

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: "600", marginBottom: 8, color: "#e5e7eb" }}>
              Image
            </Text>
            <PostImagePicker
              value={imageUri}
              onChange={(uri) => setImageUri(uri)}
            />
          </View>

          <View
            style={{
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontWeight: "600", color: "#e5e7eb" }}>
                I {didCook ? "cooked" : "ate"} this
              </Text>
              <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                (Not yet saved – future schema field)
              </Text>
            </View>
            <Switch
              value={didCook}
              onValueChange={setDidCook}
              trackColor={{ false: "#374151", true: "#1f2937" }}
              thumbColor={didCook ? "#9ca3af" : "#9ca3af"}
            />
          </View>

          {imageUri && !remoteImageUri && (
            <Text style={{ marginBottom: 16, fontSize: 12, color: "#9ca3af" }}>
              Image selected and ready to upload.
            </Text>
          )}

          {loadingRemote && (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={{ marginLeft: 8, fontSize: 12, color: "#9ca3af" }}>
                Loading uploaded image…
              </Text>
            </View>
          )}

          <View style={{ marginTop: 8 }}>
            {createPostMutation.isPending ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ActivityIndicator color="#fff" />
                <Text style={{ marginLeft: 12, color: "#e5e7eb" }}>Posting…</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isValid}
                style={{
                  backgroundColor: isValid ? "#1f2937" : "#374151",
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {isValid ? "Post" : "Fill required fields"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
