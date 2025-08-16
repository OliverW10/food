import { prisma } from "@/services/prisma_global";
import { Text } from "react-native";

export async function FetchUsers() {
    "use server";
    const users = await prisma.user.findMany();
    return <>
        {users.map(user => (
            <Text key={user.id}>{user.name}</Text>
        ))}
    </>;
}
