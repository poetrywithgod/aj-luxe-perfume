import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { token, password } = (body ?? {}) as Record<string, unknown>;

  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Missing reset token" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  const customer = await withDbRetry(() =>
    prisma.customer.findUnique({ where: { passwordResetToken: token } }),
  );

  if (!customer || !customer.passwordResetExpires) {
    return NextResponse.json(
      { error: "This reset link is invalid or has already been used." },
      { status: 400 },
    );
  }
  if (customer.passwordResetExpires < new Date()) {
    return NextResponse.json(
      { error: "This reset link has expired. Please request a new one." },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(password);

  await withDbRetry(() =>
    prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        // A successful reset is as good a reason as any failed-attempt
        // counter reset — the account owner just proved control of the
        // inbox tied to the account.
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
  );

  // Sign them in immediately rather than bouncing to /login — they just
  // proved ownership of the account via the emailed link.
  await createSession(customer.id);

  return NextResponse.json({ id: customer.id });
}
