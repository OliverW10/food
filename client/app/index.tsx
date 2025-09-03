import CornerButton from "@/components/corner-button";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Text } from "react-native";
import Login from "./login";

export default function Index() {
  return (
    <>
      <CornerButton onPress={() => router.push("/profile")} isTop={true}>
        <Text>Profile</Text>
      </CornerButton>
      <CornerButton onPress={() => router.push("/post")} isTop={false}>
        <Text>Post</Text>
      </CornerButton>
      <React.Suspense fallback={ <ActivityIndicator /> }>
        <Text>Home page</Text>
      </React.Suspense>
      <Login></Login>
    </>
  );
}
