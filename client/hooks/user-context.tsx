import { createContext, use, type PropsWithChildren } from 'react';
import { useStorageState } from './use-storage-state.ts';

const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [_, setRefreshToken] = useStorageState('refreshToken');

  const signIn = async (email: string, password: string) => {
    const res = await fetch('http://localhost:3000/trpc/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    const { accessToken, refreshToken } = json.result.data;

    setSession(accessToken);
    setRefreshToken(refreshToken);
  }

  const signOut = () => {
    setSession(null);
    setRefreshToken(null);
  }

  return (
    <AuthContext
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}>
      {children}
    </AuthContext>
  );
}
