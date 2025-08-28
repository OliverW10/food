import trpc from "@/services/trpc";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { User } from "../../server/src/generated/prisma";

export default function Index() {
  const [users, setUsers] = useState<User[] | null>(null);
  useEffect(() => {
    (async () => {
      setUsers(await trpc.userList.query());
    })();
    // Fetch users here
  }, []);
  return (
    <>
      <Text>No load!</Text>
      <React.Suspense fallback={ <ActivityIndicator /> }>
        {
          users?.map(user => {
                return <Text key={user.id}>{user.name}</Text>
            })
        }
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
