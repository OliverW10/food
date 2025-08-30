import { VersionInfoComponent } from "@/components/version-info";
import { serverUrl } from "@/services/trpc";
import React from "react";
import { ActivityIndicator, Text } from "react-native";

export default function Index() {
  return (
    <>
      <Text>Using backend {serverUrl}</Text>
      <React.Suspense fallback={ <ActivityIndicator /> }>
        <VersionInfoComponent />
      </React.Suspense>
    </>
  );
}
