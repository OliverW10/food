import renderInfo from "@/actions/render-info";
import React from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  return (
    <React.Suspense
      fallback={
        // The view that will render while the Server Function is awaiting data.
        <ActivityIndicator />
      }>
      {renderInfo({ name: 'World' })}
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
