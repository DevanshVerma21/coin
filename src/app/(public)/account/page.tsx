import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, User as UserIcon, KeyRound } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { ChangePasswordButton } from "@/components/account/change-password-button";

export const metadata: Metadata = {
  title: "My Account — NTIK Heritage Archive",
  description: "Manage your NTIK Heritage collector account.",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Curator (Admin)",
  buyer: "Collector",
  viewer: "Visitor",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/account");

  const { name, email, image, role } = session.user;

  // Normal users (buyer/viewer) — no admin privileges shown anywhere
  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen px-5 sm:px-8" style={{ background: "#f5f0e8" }}>
      <div className="max-w-[580px] mx-auto py-12 sm:py-16">

        {/* Page header */}
        <div className="mb-8">
          <p
            className="mb-2 tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-public-sans)", fontSize: "11px", color: "#8a7560", fontWeight: 500 }}
          >
            Collector Profile
          </p>
          <h1
            className="font-serif font-bold"
            style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "#1a1208" }}
          >
            My Account
          </h1>
        </div>

        {/* Profile card */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(166,148,120,0.3)",
            borderRadius: "2px",
          }}
        >
          {/* Avatar + name */}
          <div
            className="flex items-center gap-4 p-6"
            style={{ borderBottom: "1px solid rgba(166,148,120,0.2)" }}
          >
            {image ? (
              // Use plain <img> — Google profile photos are from lh3.googleusercontent.com
              // which is external. Plain img avoids next/image domain restriction.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name ?? "Profile photo"}
                width={64}
                height={64}
                className="rounded-full object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
                style={{ border: "2px solid #d4af37", width: 64, height: 64 }}
              />
            ) : (
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-[24px] font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #735c00, #d4af37)" }}
              >
                {name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}

            <div className="min-w-0">
              <h2
                className="font-serif font-semibold text-[20px] truncate"
                style={{ color: "#1a1208" }}
              >
                {name ?? "Collector"}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#735c00" }} />
                <span
                  className="text-[12px] font-semibold tracking-wide"
                  style={{ fontFamily: "var(--font-public-sans)", color: "#735c00" }}
                >
                  {ROLE_LABELS[role] ?? "Collector"}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <DetailRow icon={<Mail className="h-4 w-4" style={{ color: "#735c00" }} />} label="Email Address">
              {email}
            </DetailRow>

            <DetailRow icon={<KeyRound className="h-4 w-4" style={{ color: "#735c00" }} />} label="Sign-in Method">
              {image ? "Google OAuth" : "Email & Password"}
            </DetailRow>

            <DetailRow icon={<UserIcon className="h-4 w-4" style={{ color: "#735c00" }} />} label="Account Status">
              Active Collector Account
            </DetailRow>
          </div>

          {/* Actions */}
          <div
            className="flex flex-col sm:flex-row gap-3 p-6"
            style={{ borderTop: "1px solid rgba(166,148,120,0.2)" }}
          >
            {/* Admin-only link — hidden for normal users */}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center justify-center h-10 px-6 text-[12px] font-semibold tracking-[0.1em] uppercase transition-all hover:opacity-90"
                style={{
                  fontFamily: "var(--font-public-sans)",
                  background: "linear-gradient(135deg, #735c00, #d4af37)",
                  color: "#ffffff",
                  borderRadius: "2px",
                }}
              >
                Curator Dashboard
              </Link>
            )}

            <ChangePasswordButton email={email} />

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center justify-center h-10 px-6 text-[12px] font-semibold tracking-[0.1em] uppercase transition-all text-[#1a1208] hover:bg-[#1a1208] hover:text-white w-full sm:w-auto"
                style={{
                  fontFamily: "var(--font-public-sans)",
                  border: "1px solid rgba(26,18,8,0.3)",
                  borderRadius: "2px",
                }}
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6">
          <Link
            href="/"
            className="text-[12px] tracking-[0.08em] uppercase transition-colors hover:text-[#1a1208]"
            style={{ fontFamily: "var(--font-public-sans)", color: "#8a7560" }}
          >
            ← Return to Archive
          </Link>
        </div>
      </div>
    </div>
  );
}

// Small layout helper — avoids repetition
function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0"
        style={{ background: "#f0e1c3" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className="tracking-[0.1em] uppercase"
          style={{ fontFamily: "var(--font-public-sans)", fontSize: "10px", color: "#8a7560", fontWeight: 500 }}
        >
          {label}
        </p>
        <p
          className="truncate"
          style={{ fontFamily: "var(--font-eb-garamond)", fontSize: "15px", color: "#1a1208" }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}
