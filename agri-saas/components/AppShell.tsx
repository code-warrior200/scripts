"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./AuthProvider";
import { CustomerAssistant } from "./CustomerAssistant";
import { Sidebar } from "./Sidebar";

const authRoutes = ["/login", "/signup", "/forgot-password"];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShellContent>{children}</AppShellContent>
    </AuthProvider>
  );
}

function AppShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!isAuthenticated && !isAuthRoute) {
      router.replace("/login");
    }

    if (isAuthenticated && isAuthRoute) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isAuthRoute, isReady, router]);

  if (!isReady || (!isAuthenticated && !isAuthRoute)) {
    return (
      <main className="auth-page">
        <div className="auth-loading">Loading workspace...</div>
      </main>
    );
  }

  if (isAuthRoute) {
    return <main className="auth-page">{children}</main>;
  }

  return (
    <>
      <div className="app-shell">
        <Sidebar />
        <main className="content">{children}</main>
      </div>
      <CustomerAssistant />
    </>
  );
}
