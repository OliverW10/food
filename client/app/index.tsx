import trpc from "@/services/trpc";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";

export default function Index() {
  const [versionInfo, setVersionInfo] = useState<{ dbVersion: { missingInDb: string[], missingInFiles: string[] }, serverVersion: string; } | null>(null);

  useEffect(() => {
    (async () => {
      setVersionInfo(await trpc.versions.query());
    })();
    // Fetch users here
  }, []);
  return (
    <>
      <Text>No load!</Text>
      <React.Suspense fallback={ <ActivityIndicator /> }>
      {versionInfo ? (
        <>
          <Text>Server version: {versionInfo.serverVersion}</Text>
          {versionInfo.dbVersion.missingInDb.length ? <Text>Missing migrations in DB (server is ahead of database): {versionInfo.dbVersion.missingInDb.join(", ")}</Text> : "None"}
          {versionInfo.dbVersion.missingInFiles.length ? <Text>Missing migrations in server (database is ahead of server): {versionInfo.dbVersion.missingInFiles.join(", ")}</Text> : "None"}
        </>
      ) : (
        <ActivityIndicator />
      )}
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
