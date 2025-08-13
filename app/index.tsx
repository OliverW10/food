import renderInfo from "@/actions/render-info";
import testServerFunc from "@/actions/test-server-func";
import testServerFunc2 from "@/actions/test-server-func2";
import { readVersionClient, readVersionServer } from "@/actions/version-check";
import React from "react";
import { ActivityIndicator, Text } from "react-native";

export default function Index() {
  return (
    <React.Suspense
      fallback={
        // The view that will render while the Server Function is awaiting data.
        <ActivityIndicator />
      }>
      {renderInfo()}
      <Text>{testServerFunc()}</Text>
      {testServerFunc2()}
      <Text>Version from server {readVersionServer()}</Text>
      <Text>Version from client {readVersionClient()}</Text>
      {/* <View
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
