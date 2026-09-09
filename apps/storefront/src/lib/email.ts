import "server-only";

// No transactional email provider (Resend, SendGrid, Postmark, etc.) is
// wired up yet — that's a real gap, not simulated. Until one is added,
// this logs the email that *would* have been sent to the server console
// so the flow is fully testable locally, and returns the link so a
// caller could also surface it another way (e.g. in a dev-only banner)
// if needed. Swap the body of this function for a real provider call
// before going live; the call sites (account email-change, and future
// signup verification if that's ever added) don't need to change.
export async function sendVerificationEmail(to: string, verifyUrl: string) {
  console.log(
    `[email:stub] Verification link for ${to}: ${verifyUrl}\n` +
      `(No email provider configured — see src/lib/email.ts)`,
  );
}
