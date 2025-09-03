import trpc from "@/services/trpc";
import { router } from "expo-router";
import { Button, FlatList, Image, Pressable, Text, View } from "react-native";

export default function ProfilePage() {
  const { data, isLoading } = trpc.profile.get.useQuery();

  if (isLoading) return <Text>Loading...</Text>;
  if (!data) return <Text>No user</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data.posts}
        keyExtractor={(p) => String(p.id)}
        numColumns={3}
        ListHeaderComponent={
          <View>
            <Text>Profile</Text>
            <Text>Id: {data.id}</Text>
            <Text>Name: {data.name}</Text>
            <Text>Email: {data.email}</Text>
            <Button title={`Followers: ${data.followers}`} onPress={() => router.push("/follows")} />
            <Button title={`Following: ${data.following}`} onPress={() => router.push("/follows")} />
            <Button title="Add friend" onPress={() => router.push("/search")} />
            <Button title="Settings" onPress={() => router.push("/settings")} />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push({ pathname: "/post", params: { id: String(item.id) } })}
            style={{ width: "33.33%", padding: 4 }}
          >
            <View style={{ width: "100%", aspectRatio: 1, backgroundColor: "#eee", overflow: "hidden" }}>
              <Image source={require("../assets/images/pasta.png")} style={{ width: "100%", height: "100%" }} />
            </View>
            <Text numberOfLines={1}>{item.title}</Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator
      />
    </View>
  );
}
