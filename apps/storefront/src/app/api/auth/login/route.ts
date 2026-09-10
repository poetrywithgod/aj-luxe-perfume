import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import {
  verifyPassword,
  createSession,
  registerFailedLogin,
  clearFailedLogins,
} from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const customer = await withDbRetry(() =>
    prisma.customer.findUnique({ where: { email: normalizedEmail } }),
  );

  // Same generic error whether the email doesn't exist or the password is
  // wrong — avoids confirming which emails have accounts.
  const invalid = () =>
    NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  if (!customer) return invalid();

  if (customer.lockedUntil && customer.lockedUntil > new Date()) {
    return NextResponse.json(
      {
        error:
          "Too many failed attempts. Please try again in a few minutes, or reset your password.",
      },
      { status: 429 },
    );
  }

  const valid = await verifyPassword(password, customer.passwordHash);
  if (!valid) {
    await registerFailedLogin(customer.id);
    return invalid();
  }

  await clearFailedLogins(customer.id);
  await createSession(customer.id);

  return NextResponse.json({
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
  });
}
