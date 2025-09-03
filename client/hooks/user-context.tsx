import { createContext, use, type PropsWithChildren } from 'react';
import { useStorageState } from './use-storage-state.js';

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

  const signIn = async (email: string, password: string) => {
    if (email === 'a' && password === 'a') {
      const jwt = 'token';
      setSession(jwt);
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const signOut = () => {
    setSession(null);
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
