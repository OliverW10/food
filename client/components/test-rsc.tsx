// import { prisma } from "@/services/prisma_global";
import { Text } from "react-native";

export async function FetchUsers() {
    // console.log(prisma);
    // const users = await prisma.user.findMany();
    await new Promise(r => setTimeout(r, 1000));
    return <>
    <Text>Async text</Text>
    {/* {
        users.map(user => {
            return <Text key={user.id}>{user.name}</Text>
        })
    } */}
    </>;
}
