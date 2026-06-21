import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import clientPromise from "./mongodb-client";
import type { UserRole } from "@/types";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  // trustHost lets Auth.js derive the URL from the incoming request Host header.
  // This means it works on localhost, Render, Vercel, and custom domains without
  // needing NEXTAUTH_URL / AUTH_URL set — the host header is trusted automatically.
  trustHost: true,

  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const client = await clientPromise;
          const db = client.db();

          // Explicitly select password which is excluded by default
          const user = await db
            .collection("users")
            .findOne(
              { email: (credentials.email as string).toLowerCase().trim() },
              { projection: { _id: 1, name: 1, email: 1, image: 1, password: 1 } }
            );

          if (!user || !user.password) return null;

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (!valid) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image ?? null,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.id = user.id;
        token.role = adminEmails.includes(user.email.toLowerCase())
          ? ("admin" as UserRole)
          : ("buyer" as UserRole);
      }
      return token;
    },

    session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
        session.user.role = (token.role as UserRole) ?? "buyer";
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email: string;
      image?: string | null;
      role: UserRole;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
