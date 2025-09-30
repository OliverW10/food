import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from "../hooks/user-context";

export default function LoginPage() {
    const { signIn } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signIn(email, password);
        } catch {
            alert("Invalid credentials");
        }
    }

    return <SafeAreaView style={{ flex:1, padding:16 }}>
        <View>
            <Text>Email</Text>
            <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
            <Text>Password</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
        </View>
    </SafeAreaView>
}