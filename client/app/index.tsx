import trpc, { serverUrl } from "@/services/trpc";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";

const VersionInfoComponent = () => {
  const [versionInfo, setVersionInfo] = useState<{dbVersion: { missingInDb: string[], missingInFiles: string[] }, serverVersion: string} | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const localVersionInfo = await trpc.versions.query();
      setVersionInfo(localVersionInfo);
    })()
  }, [])
  // const versionInfo = use(trpc.versions.query())
  return (
      <>
        <Text>Server version: {versionInfo?.serverVersion}</Text>
        {versionInfo?.dbVersion.missingInDb.length ? <Text>Missing migrations in DB (server is ahead of database): {versionInfo.dbVersion.missingInDb.join(", ")}</Text> : "None"}
        {versionInfo?.dbVersion.missingInFiles.length ? <Text>Missing migrations in server (database is ahead of server): {versionInfo.dbVersion.missingInFiles.join(", ")}</Text> : "None"}
      </>
  )
}

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
