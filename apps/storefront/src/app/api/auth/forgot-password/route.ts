import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { sendPasswordResetEmail } from "@/lib/email";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour — shorter than the
// 24h email-change window, since a leaked reset link is more dangerous.

// Always the same response whether or not the email matches an account —
// otherwise this endpoint becomes a way to check which emails have
// accounts.
const GENERIC_RESPONSE = NextResponse.json({
  message: "If an account exists for that email, a reset link has been sent.",
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email } = (body ?? {}) as Record<string, unknown>;
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const customer = await withDbRetry(() =>
    prisma.customer.findUnique({ where: { email: normalizedEmail } }),
  );

  if (customer) {
    const token = randomBytes(32).toString("hex");
    await withDbRetry(() =>
      prisma.customer.update({
        where: { id: customer.id },
        data: {
          passwordResetToken: token,
          passwordResetExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      }),
    );

    const origin = new URL(request.url).origin;
    const resetUrl = `${origin}/reset-password?token=${token}`;
    await sendPasswordResetEmail(normalizedEmail, resetUrl);
  }

  return GENERIC_RESPONSE;
}
