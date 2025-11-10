"use client";

/**
 * NextAuth SessionProvider wrapper.
 * This makes the session available to all client components.
 */
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
