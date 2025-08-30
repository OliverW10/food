import { router } from "expo-router";
import { Button, Text } from "react-native";

export default function ProfilePage() {
    return <>
        <Text>Profile</Text>
        <Button title="Followers" onPress={() => router.push("/follows")} />
        <Button title="Following" onPress={() => router.push("/follows")} />
        <Button title="Add friend" onPress={() => router.push("/search")} />
        <Button title="Settings" onPress={() => router.push("/settings")} />
    </>
}