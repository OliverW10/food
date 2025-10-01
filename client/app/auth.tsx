import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../hooks/user-context";
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
      router.replace("/");
    } catch (err: any) {
      alert("Login failed: " + (err?.message || "Error logging in"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#111827",
        padding: 24,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#1f2937",
        width: 320,
        gap: 18,
        alignItems: "stretch",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Login
      </Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          backgroundColor: "#1f2937",
          color: "#fff",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#374151",
          padding: 12,
          marginBottom: 8,
        }}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: "#1f2937",
          color: "#fff",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#374151",
          padding: 12,
          marginBottom: 8,
        }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#1f2937",
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
          marginBottom: 8,
          borderWidth: 1,
          borderColor: "#374151",
        }}
        disabled={loading}
      >
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
          {loading ? "Logging in..." : "Log In"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSwitch}
        style={{ alignItems: "center", marginTop: 4 }}
      >
        <Text style={{ color: "#9ca3af" }}>Create Account</Text>
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
    try {
      await registerMutation.mutateAsync({ email, password });
      alert("Account created!");
      onSwitch();
    } catch (err: any) {
      console.log("sign up failed");
      alert(err?.message || "Error creating account");
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#111827",
        padding: 24,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#1f2937",
        width: 320,
        gap: 18,
        alignItems: "stretch",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Register
      </Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          backgroundColor: "#1f2937",
          color: "#fff",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#374151",
          padding: 12,
          marginBottom: 8,
        }}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: "#1f2937",
          color: "#fff",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#374151",
          padding: 12,
          marginBottom: 8,
        }}
      />
      <TouchableOpacity
        onPress={handleSignup}
        style={{
          backgroundColor: "#1f2937",
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
          marginBottom: 8,
          borderWidth: 1,
          borderColor: "#374151",
        }}
        disabled={loading}
      >
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
          {loading ? "Signing up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSwitch}
        style={{ alignItems: "center", marginTop: 4 }}
      >
        <Text style={{ color: "#9ca3af" }}>Log In to Existing Account</Text>
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
      router.replace("/");
    }
  }, [session, router]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#0b0f16",
      }}
    >
      {isLogin ? (
        <LoginForm onSwitch={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitch={() => setIsLogin(true)} />
      )}
    </SafeAreaView>
  );
}
