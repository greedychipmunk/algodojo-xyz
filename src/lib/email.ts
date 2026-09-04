import "server-only";

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : undefined;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

/**
 * Send a password reset email via Resend.
 */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<boolean> {
  if (!resend) {
    console.error(
      "RESEND_API_KEY is not set — password reset email cannot be sent.",
    );
    console.error(`Password reset URL (dev only): ${resetUrl}`);
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Set your Algo Dojo password",
      html: renderResetEmail(resetUrl),
    });

    if (error) {
      console.error("Resend error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return false;
  }
}

function renderResetEmail(resetUrl: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
    <h1 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Set your Algo Dojo password</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #555;">
      Your account is ready. Click the button below to set your password and start accessing premium tutorials.
    </p>
    <p style="margin: 24px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: #f97316; color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
        Set Password
      </a>
    </p>
    <p style="font-size: 13px; color: #888;">
      Or copy this link: ${resetUrl}
    </p>
    <p style="font-size: 13px; color: #888; margin-top: 24px;">
      If you didn't create an account on Algo Dojo, you can safely ignore this email.
    </p>
  </body>
</html>`;
}
