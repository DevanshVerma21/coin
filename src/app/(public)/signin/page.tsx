import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";
import { AuthForm } from "./_auth-form";

export const metadata: Metadata = {
  title: "Sign In — NTIK Heritage Archive",
  description: "Sign in or create your NTIK Heritage collector account.",
};

const OAUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked: "This email is already linked to a different provider.",
  OAuthCallbackError: "Sign-in was cancelled or an error occurred. Please try again.",
  AccessDenied: "Access was denied. Please contact the curator.",
  Default: "Something went wrong during sign-in. Please try again.",
};

interface PageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string; mode?: string }>;
}

export default async function SignInPage({ searchParams }: PageProps) {
  const session = await auth();
  if (session) redirect("/");

  const params = await searchParams;
  const oauthError = params.error
    ? (OAUTH_ERRORS[params.error] ?? OAUTH_ERRORS.Default)
    : null;
  const callbackUrl = params.callbackUrl ?? "/";

  async function googleSignIn() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl });
  }

  async function credSignIn(
    formData: FormData
  ): Promise<{ error?: string } | undefined> {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: callbackUrl,
      });
    } catch (err) {
      if (err instanceof AuthError) {
        return { error: "Invalid email or password. Please try again." };
      }
      throw err;
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-10 sm:py-14"
      style={{ background: "#f5f0e8", minHeight: "calc(100vh - 60px)" }}
    >
      <div className="w-full max-w-[420px]">
        <AuthForm
          googleAction={googleSignIn}
          credSignInAction={credSignIn}
          oauthError={oauthError}
          callbackUrl={callbackUrl}
        />
      </div>
    </div>
  );
}
