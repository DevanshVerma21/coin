import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [Google],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    authorized({ auth: authState, request: { nextUrl } }) {
      const isLoggedIn = !!authState?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        // Logged-in check only — role check happens inside admin layout
        return isLoggedIn;
      }

      return true;
    },
  },
};
