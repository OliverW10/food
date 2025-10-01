import trpc, { getTrpcServerUrl } from "@/services/trpc";
import { version } from "@/version";
import { Text } from "react-native";

export const VersionInfoComponent = () => {
  const [versionInfo, versionInfoQuery] = trpc.versions.useSuspenseQuery();
  return (
    <>
      <Text>Server url: {getTrpcServerUrl()}</Text>
      <Text>Server version: {versionInfo?.serverVersion}</Text>
      <Text>Client version: {version}</Text>
      <Text>DB migrations: {versionInfo.dbMigrations.join(", ")}</Text>
      {versionInfo.missingInDb.length ? (
        <Text>
          Missing migrations in DB (server is ahead of database):{" "}
          {versionInfo.missingInDb.join(", ")}
        </Text>
      ) : (
        ""
      )}
      {versionInfo.missingInFiles.length ? (
        <Text>
          Missing migrations in server (database is ahead of server):{" "}
          {versionInfo.missingInFiles.join(", ")}
        </Text>
      ) : (
        ""
      )}
    </>
  );
};
