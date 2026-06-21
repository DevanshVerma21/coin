import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "NTIK Heritage <noreply@resend.dev>";
// Never fall back to localhost — if NEXT_PUBLIC_SITE_URL is unset in production
// the email links would break. Fail loudly in that case.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "") ||
  (process.env.NODE_ENV === "production"
    ? (() => { throw new Error("NEXT_PUBLIC_SITE_URL must be set in production"); })()
    : "http://localhost:3000");
const SITE_NAME = "NTIK Heritage";

function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${SITE_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border:1px solid rgba(166,148,120,0.4);border-radius:2px;">

        <!-- Header -->
        <tr>
          <td style="padding:28px 36px 20px;border-bottom:1px solid rgba(166,148,120,0.25);text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.08em;color:#1a1208;font-family:'Georgia',serif;">
              NTIK
            </p>
            <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8a7560;font-family:Arial,sans-serif;">
              Heritage Numismatic Archive
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:32px 36px;">${body}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 36px 24px;border-top:1px solid rgba(166,148,120,0.2);background:#faf6ef;text-align:center;">
            <p style="margin:0;font-size:11px;color:#a89880;font-family:Arial,sans-serif;line-height:1.5;">
              This email was sent by ${SITE_NAME}. If you did not request this, you can safely ignore it.<br/>
              © ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendPasswordResetEmail(
  to: string,
  token: string
): Promise<void> {
  const resetUrl = `${SITE}/reset-password?token=${token}`;

  const body = `
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#1a1208;font-family:'Georgia',serif;">
      Reset Your Password
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b5c45;line-height:1.6;font-family:'Georgia',serif;font-style:italic;">
      We received a request to reset the password for your NTIK Heritage account.
    </p>
    <p style="margin:0 0 8px;font-size:13px;color:#4d4635;font-family:Arial,sans-serif;">
      Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#1a1208;border-radius:2px;">
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 28px;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#f5f0e8;text-decoration:none;font-family:Arial,sans-serif;">
            Reset Password →
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 4px;font-size:12px;color:#8a7560;font-family:Arial,sans-serif;">
      Or copy this link into your browser:
    </p>
    <p style="margin:0;font-size:11px;color:#735c00;word-break:break-all;font-family:monospace;">
      ${resetUrl}
    </p>
    <p style="margin:24px 0 0;font-size:12px;color:#8a7560;font-family:Arial,sans-serif;border-top:1px solid rgba(166,148,120,0.2);padding-top:16px;">
      If you did not request a password reset, no action is required — your password remains unchanged.
    </p>`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your NTIK Heritage password",
    html: emailWrapper(body),
  });
}

export async function sendPasswordChangedEmail(to: string): Promise<void> {
  const body = `
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#1a1208;font-family:'Georgia',serif;">
      Password Changed
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b5c45;line-height:1.6;font-family:'Georgia',serif;font-style:italic;">
      Your NTIK Heritage account password was successfully updated.
    </p>
    <p style="margin:0 0 16px;font-size:13px;color:#4d4635;font-family:Arial,sans-serif;line-height:1.6;">
      If you made this change, no further action is needed.
    </p>
    <p style="margin:0;font-size:13px;color:#ba1a1a;font-family:Arial,sans-serif;line-height:1.6;">
      <strong>If you did not change your password</strong>, please reset it immediately and contact us.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#1a1208;border-radius:2px;">
          <a href="${SITE}/forgot-password"
             style="display:inline-block;padding:12px 28px;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#f5f0e8;text-decoration:none;font-family:Arial,sans-serif;">
            Reset Now →
          </a>
        </td>
      </tr>
    </table>`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your NTIK Heritage password was changed",
    html: emailWrapper(body),
  });
}
