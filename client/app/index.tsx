import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Button, Text } from "react-native";

export default function Index() {
  return (
    <>
      <Button title="Profile" onPress={() => router.push("/profile")} />
      <Button title="Post" onPress={() => router.push("/post")} />
      <React.Suspense fallback={ <ActivityIndicator /> }>
        <Text>Home page</Text>
      </React.Suspense>
    </>
  );
}
