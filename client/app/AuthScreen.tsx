import { registerForPushNotificationsAsync } from '@/services/notifications';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../hooks/user-context';
import trpc from "../services/trpc";

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const { signIn } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // TODO: could show loading indicator
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Email and password are required");
            return;
        }
        setLoading(true);
        try {
            await signIn(email, password);
            router.replace('/');
        } catch (err: any) {
            alert("Login failed: " + (err?.message || 'Error logging in'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <Text>Login</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Log In" onPress={handleLogin}></Button>
            <TouchableOpacity onPress={onSwitch}>
                <Text>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
}

function SignupForm({ onSwitch }: { onSwitch: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // TODO: could show loading indicator

    const registerMutation = trpc.auth.register.useMutation();

    const handleSignup = async () => {
        if (!email || !password) {
            alert("Email and password are required");
            return;
        }
        setLoading(true);
        const expoPushToken = await registerForPushNotificationsAsync(); // applicationId?
        try {
            await registerMutation.mutateAsync({ email, password, token: expoPushToken });
            alert("Account created!");
            onSwitch();
        } catch (err: any) {
            console.log("sign up failed");
            alert(err?.message || 'Error creating account');
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Text>Register</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Sign Up" onPress={handleSignup}></Button>
            <TouchableOpacity onPress={onSwitch}>
                <Text>Log In to Existing Account</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const { session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace('/');
        }
    }, [session, router]);

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            {isLogin ? (
                <LoginForm onSwitch={() => setIsLogin(false)} />
            ) : (
                <SignupForm onSwitch={() => setIsLogin(true)} />
            )}
        </SafeAreaView>
    )
}