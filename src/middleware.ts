import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

// Only run middleware on admin routes — all other pages handle their own auth
// via auth() server-side. Broad matchers can interfere with JWT verification.
export const config = {
  matcher: ["/admin/:path*"],
};
