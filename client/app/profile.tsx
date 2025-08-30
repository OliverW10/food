import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function ProfilePage() {
    return <>
        <Text>Profile</Text>
        <View style={{ gap: 5 }}>
            <Button title="Followers" onPress={() => router.push("/follows")} />
            <Button title="Following" onPress={() => router.push("/follows")} />
            <Button title="Add friend" onPress={() => router.push("/search")} />
            <Button title="Settings" onPress={() => router.push("/settings")} />
        </View>
    </>
}