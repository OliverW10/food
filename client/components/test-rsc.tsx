import trpc from "@/services/trpc";
import { Text } from "react-native";

export async function FetchUsers() {
    const users = await trpc.userList.query();
    return <>
        {
            users.map(user => {
                return <Text key={user.id}>{user.name}</Text>
            })
        }
    </>;
}
