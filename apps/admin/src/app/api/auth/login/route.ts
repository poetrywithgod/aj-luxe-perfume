import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { verifyPassword, createSession } from "@/lib/auth";

// No lockout/rate-limiting here yet, unlike the storefront's customer
// login — flagged as a gap worth closing before this is exposed publicly,
// though an admin login page is a much smaller attack surface (not
// linked from anywhere public, small number of known accounts).
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

  const admin = await withDbRetry(() =>
    prisma.adminUser.findUnique({ where: { email: normalizedEmail } }),
  );

  const invalid = () =>
    NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  if (!admin) return invalid();

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return invalid();

  await createSession(admin.id);

  return NextResponse.json({ id: admin.id, name: admin.name, email: admin.email });
}
