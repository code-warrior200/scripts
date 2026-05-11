"use client";

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

// Re-export NextAuth hooks and functions
export { useSession, signIn, signOut } from "next-auth/react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

// Extended user type with role and organization
export interface AuthUser {
  name: string | null;
  email: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  organizationId?: string | null;
}

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: { name: string; organizationName?: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthContext.Provider");
  }
  return context;
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        id: session.user.id,
        role: (session.user as any).role,
        organizationId: (session.user as any).organizationId,
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }
    if (status !== "loading") {
      setIsReady(true);
    }
  }, [session, status]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      isAuthenticated: !!user,
      login: async ({ email, password }: { email: string; password: string }) => {
        const result = await signIn("credentials", { email, password, redirect: false });
        if (result?.error) {
          throw new Error(result.error);
        }
      },
      signup: async ({ name, organizationName, email, password }: { name: string; organizationName?: string; email: string; password: string }) => {
        // Create user via API
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, organizationName, email, password }),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Signup failed");
        }
        // Sign in after signup
        await signIn("credentials", { email, password, redirect: false });
      },
      logout: () => signOut({ redirect: false }),
    }),
    [user, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}