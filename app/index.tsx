import { FetchUsers } from "@/components/test-rsc";
import React from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  return (
    <React.Suspense
      fallback={
        // The view that will render while the Server Function is awaiting data.
        <ActivityIndicator />
      }>
      {/* {renderInfo()} */}
      <FetchUsers />
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
    </React.Suspense>
  );
}
