import PostImagePicker from "@/components/PostImagePicker";
import { TopNav } from "@/components/TopNav";
import { SimplePreset, TypeSelect } from "@/components/type-select";
import { useSession } from "@/hooks/user-context";
import { fetchWithAuth } from "@/services/fetch-with-auth";
import trpc, { getTrpcServerUrl } from "@/services/trpc";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostPage() {
  const { user } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [didCook, setDidCook] = useState(true); // Not persisted yet – placeholder for future schema
  const [touched, setTouched] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null); // local selected (pre-upload)
  const [remoteImageUri, setRemoteImageUri] = useState<string | null>(null); // from API after save or existing post
  const [loadingRemote, setLoadingRemote] = useState(false);

  const createPostMutation = trpc.post.create.useMutation();

  const setTitleAndPreset = (val: string, isPreset: boolean) => {
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
      //uploadImage
      const imageId = await uploadImage();
      if (!imageId) {
        Alert.alert("Error", "Failed to upload image");
        return;
      }

      // create Post
      const created = await createPostMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        imageId,
        authorId: parseInt(user.id, 10),
      });
      if (created?.image?.storageUrl) {
        setLoadingRemote(true);
        // Simulate async fetch/validation step (could add HEAD request etc.)
        setRemoteImageUri(getTrpcServerUrl() + created.image.storageUrl);
        setLoadingRemote(false);
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

      const uploadResponse = await fetchWithAuth("api/upload", {
        method: "POST",
        body: formData,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <TopNav />
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>
            Create Post
          </Text>

          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>Title</Text>
            <TypeSelect
              value={title}
              onChange={setTitleAndPreset}
              presets={presets}
              placeholder="E.g. Homemade ramen"
            />
            {touched && title.trim().length === 0 && (
              <Text style={{ color: "#dc2626", marginTop: 4 }}>
                Title is required.
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>
              Description (optional)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder=""
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
                padding: 10,
                borderRadius: 8,
                backgroundColor: "#f9fafb",
                textAlignVertical: "top",
                minHeight: 120,
              }}
              onBlur={() => setTouched(true)}
            />
            {touched && description.trim().length === 0 && (
              <Text style={{ color: "#dc2626", marginTop: 4 }}>
                Description is required.
              </Text>
            )}
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#e5e7eb",
              marginVertical: 20,
            }}
          />

          <PostImagePicker
            value={imageUri}
            onChange={(uri) => setImageUri(uri)}
            label="Image (optional)"
          />
          <View
            style={{
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontWeight: "600" }}>
                I {didCook ? "cooked" : "ate"} this
              </Text>
              <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                (Not yet saved – future schema field)
              </Text>
            </View>
            <Switch value={didCook} onValueChange={setDidCook} />
          </View>

          {imageUri && !remoteImageUri && (
            <Text style={{ marginBottom: 16, fontSize: 12, color: "#6b7280" }}>
              Image selected and ready to upload.
            </Text>
          )}
          {loadingRemote && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <ActivityIndicator size="small" />
              <Text style={{ marginLeft: 8, fontSize: 12 }}>
                Loading uploaded image…
              </Text>
            </View>
          )}
          {remoteImageUri && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontWeight: "600", marginBottom: 8 }}>
                Uploaded Image
              </Text>
              <Image
                source={{ uri: remoteImageUri }}
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: 12,
                  backgroundColor: "#f3f4f6",
                }}
                resizeMode="cover"
              />
            </View>
          )}

          <View style={{ marginBottom: 40 }}>
            {createPostMutation.isPending ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ActivityIndicator color="#111827" />
                <Text style={{ marginLeft: 12 }}>Posting…</Text>
              </View>
            ) : (
              <Button
                title={isValid ? "Post" : "Fill required fields"}
                onPress={handleSubmit}
                disabled={!isValid}
                color={isValid ? undefined : "#9ca3af"}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
