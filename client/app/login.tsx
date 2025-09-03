import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (email === 'a' && password === 'a') {
            
        } else {
            alert("Invalid credentials");
        } 
    }

    return <>
        <View>
            <Text>Email</Text>
            <TextInput value={email} onChangeText={setEmail} />
            <Text>Password</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Login" onPress={handleLogin} />
        </View>
    </>
}