// Mukund
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../hooks/user-context";
import trpc from "../services/trpc";

const containerStyle = {
  backgroundColor: "#111827",
  padding: 24,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#1f2937",
  width: 320,
};

const titleStyle = {
  color: "#fff",
  fontSize: 22,
  fontWeight: "700" as const,
  marginBottom: 8,
  textAlign: "center" as const,
};

const inputStyle = {
  backgroundColor: "#1f2937",
  color: "#fff",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#374151",
  padding: 12,
  marginBottom: 8,
};

const buttonStyle = {
  backgroundColor: "#1f2937",
  borderRadius: 10,
  paddingVertical: 12,
  alignItems: "center" as const,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: "#374151",
};

const linkStyle = {
  alignItems: "center" as const,
  marginTop: 4,
};

const linkTextStyle = {
  color: "#9ca3af",
};

function AuthInput(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput {...props} style={[inputStyle, props.style]} />;
}

function AuthButton({ onPress, children, loading, style, ...rest }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[buttonStyle, style]}
      disabled={loading}
      {...rest}
    >
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

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
    <View style={containerStyle}>
      <Text style={titleStyle}>Login</Text>
      <AuthInput
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <AuthInput
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AuthButton onPress={handleLogin} loading={loading}>
        {loading ? "Logging in..." : "Log In"}
      </AuthButton>
      <TouchableOpacity onPress={onSwitch} style={linkStyle}>
        <Text style={linkTextStyle}>Create Account</Text>
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
    <View style={containerStyle}>
      <Text style={titleStyle}>Register</Text>
      <AuthInput
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <AuthInput
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AuthButton onPress={handleSignup} loading={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </AuthButton>
      <TouchableOpacity onPress={onSwitch} style={linkStyle}>
        <Text style={linkTextStyle}>Log In to Existing Account</Text>
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
