// Mukund
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  use,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import trpc from "../services/trpc";
import { useStorageState } from "./use-storage-state";

type User = {
  id: string;
  email: string;
};

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  user?: User | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
  user: null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [_, setRefreshToken] = useStorageState("refreshToken");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const signInMutation = trpc.auth.login.useMutation();

  useEffect(() => {
    if (session) {
      try {
        const decoded = jwtDecode<any>(session);
        setUser({ id: decoded.sub, email: decoded.email });
      } catch (e) {
        console.log("Invalid token");
        console.log(e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [session]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in", email);

      const res = await signInMutation.mutateAsync({ email, password });
      const { accessToken, refreshToken } = res;

      setSession(accessToken);
      setRefreshToken(refreshToken);
      console.log("sign in success");
      router.replace("/");
    } catch (err: any) {
      console.log("sign in failed");
      alert(err?.message || "Error signing in");
    }
  };

  const signOut = () => {
    setSession(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext
      value={{
        signIn,
        signOut,
        session,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext>
  );
}
