import { FetchUsers } from "@/components/test-rsc";
import React from "react";
import { ActivityIndicator, Text } from "react-native";

export default function Index() {
  return (
    <>
      <Text>No load!</Text>
      <React.Suspense fallback={ <ActivityIndicator /> }>
        {FetchUsers()}
      </React.Suspense>
      
      {/* <Text>Version from server {readVersionServer()}</Text>
      <Text>Version from client {readVersionClient()}</Text>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        >
        <Text>Edit app/index.tsx to edit this screen.</Text>
      </View> */}
    </>
  );
}
