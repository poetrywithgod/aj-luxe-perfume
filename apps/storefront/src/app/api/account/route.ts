import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { getSessionCustomerId } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  if (normalizedEmail !== (await getCurrentEmail(customerId))) {
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

  const updated = await withDbRetry(() =>
    prisma.customer.update({
      where: { id: customerId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
      },
    }),
  );

  return NextResponse.json({
    id: updated.id,
    firstName: updated.firstName,
    lastName: updated.lastName,
    email: updated.email,
    phone: updated.phone,
  });
}

async function getCurrentEmail(customerId: string) {
  const current = await withDbRetry(() =>
    prisma.customer.findUnique({
      where: { id: customerId },
      select: { email: true },
    }),
  );
  return current?.email ?? null;
}
