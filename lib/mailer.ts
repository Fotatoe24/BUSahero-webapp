import nodemailer from "nodemailer";

// Reuses the same Gmail SMTP credentials already configured in the
// Supabase dashboard, but sends directly from our own server code —
// needed because Supabase Auth's built-in mailer only fires for
// auth.users accounts, and this app no longer creates those.
//
// NOTE: Gmail SMTP requires an "App Password" (Google Account ->
// Security -> 2-Step Verification -> App Passwords), not your normal
// Gmail login password. A regular password will fail to authenticate.

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER / SMTP_PASS are not configured.");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const fromName = process.env.SMTP_FROM_NAME || "BUSAhero";
  const fromEmail = process.env.SMTP_USER;

  await getTransporter().sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: "Reset your BUSAhero password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#101e4a;">Reset your password</h2>
        <p>We received a request to reset the password for your BUSAhero operator account.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#2e5cf0;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
        </p>
        <p style="font-size:12px;color:#6b7290;">
          This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
