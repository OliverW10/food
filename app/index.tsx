import renderInfo from "@/actions/render-info";
import testServerFunc from "@/actions/test-server-func";
import testServerFunc2 from "@/actions/test-server-func2";
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
