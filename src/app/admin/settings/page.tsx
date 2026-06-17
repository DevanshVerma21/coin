import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — Admin" };

export default function AdminSettingsPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "Not set";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Not set";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "Not set";
  const gcsBucket = process.env.GCS_BUCKET_NAME ?? "Not set";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Environment configuration overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-2xl">
        {[
          { label: "Site Name", value: siteName },
          { label: "Site URL", value: siteUrl },
          { label: "WhatsApp Number", value: whatsapp },
          { label: "GCS Bucket", value: gcsBucket },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4"
          >
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {row.label}
              </p>
              <p className="text-sm font-semibold mt-0.5">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-5 py-4 max-w-2xl">
        <p className="text-sm font-semibold text-amber-800 mb-1">Configuration</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          All settings are managed via environment variables in{" "}
          <code className="bg-amber-100 px-1 rounded">.env.local</code>. Update values there and
          redeploy to apply changes. See{" "}
          <code className="bg-amber-100 px-1 rounded">.env.local.example</code> for all available
          variables.
        </p>
      </div>
    </div>
  );
}
