import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Authorization is handled in src/auth.ts (server-side only)
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth: session, request }) {
      return true;
    },
  },
} satisfies NextAuthConfig;