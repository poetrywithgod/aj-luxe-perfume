import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { getSessionCustomerId } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function PATCH(request: Request) {
  const customerId = await getSessionCustomerId();
  if (!customerId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { firstName, lastName, email, phone } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    !firstName.trim() ||
    !lastName.trim()
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const current = await withDbRetry(() =>
    prisma.customer.findUnique({
      where: { id: customerId },
      select: { email: true },
    }),
  );
  if (!current) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const emailIsChanging = normalizedEmail !== current.email;

  if (emailIsChanging) {
    const existing = await withDbRetry(() =>
      prisma.customer.findUnique({ where: { email: normalizedEmail } }),
    );
    if (existing && existing.id !== customerId) {
      return NextResponse.json(
        { error: "That email is already in use" },
        { status: 409 },
      );
    }
  }

  // Name/phone changes take effect immediately either way. An email
  // change is held as `pendingEmail` behind a verification link rather
  // than applied to the real `email` column right away — see
  // src/lib/email.ts for why sending is currently a console-log stub.
  const updated = await withDbRetry(() =>
    prisma.customer.update({
      where: { id: customerId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
        ...(emailIsChanging
          ? {
              pendingEmail: normalizedEmail,
              emailVerifyToken: randomBytes(32).toString("hex"),
              emailVerifyExpires: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
            }
          : {}),
      },
    }),
  );

  if (emailIsChanging && updated.emailVerifyToken) {
    const origin = new URL(request.url).origin;
    const verifyUrl = `${origin}/account/verify-email?token=${updated.emailVerifyToken}`;
    await sendVerificationEmail(normalizedEmail, verifyUrl);
  }

  return NextResponse.json({
    id: updated.id,
    firstName: updated.firstName,
    lastName: updated.lastName,
    email: updated.email,
    phone: updated.phone,
    pendingEmail: updated.pendingEmail,
    emailChangePending: emailIsChanging,
  });
}
