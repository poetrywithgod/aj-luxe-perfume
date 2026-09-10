import "server-only";

// No transactional email provider (Resend, SendGrid, Postmark, etc.) is
// wired up yet — that's a real gap, not simulated. Until one is added,
// these log the email that *would* have been sent to the server console
// so the flows are fully testable locally, and return nothing further —
// a caller could layer on a dev-only banner using the URL it already
// has if needed. Swap these bodies for real provider calls before going
// live; call sites don't need to change.

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  console.log(
    `[email:stub] Verification link for ${to}: ${verifyUrl}\n` +
      `(No email provider configured — see src/lib/email.ts)`,
  );
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  console.log(
    `[email:stub] Password reset link for ${to}: ${resetUrl}\n` +
      `(No email provider configured — see src/lib/email.ts)`,
  );
}
