"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthUser = {
  name: string;
  email: string;
  organization?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type SignupInput = LoginInput & {
  name: string;
  organization: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => void;
  signup: (input: SignupInput) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "agri-saas-auth-user";
const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function persistUser(user: AuthUser) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function deriveNameFromEmail(email: string) {
  const name = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();

  return name ? name.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Farm Manager";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setIsReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      isAuthenticated: Boolean(user),
      login: ({ email }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const nextUser = getStoredUser() ?? {
          email: normalizedEmail,
          name: deriveNameFromEmail(normalizedEmail),
        };

        const normalizedUser = {
          ...nextUser,
          email: normalizedEmail,
        };

        persistUser(normalizedUser);
        setUser(normalizedUser);
      },
      signup: ({ email, name, organization }) => {
        const nextUser = {
          email: email.trim().toLowerCase(),
          name: name.trim(),
          organization: organization.trim(),
        };

        persistUser(nextUser);
        setUser(nextUser);
      },
      logout: () => {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
      },
    }),
    [isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
