import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma, withDbRetry } from "db";

// Mirrors apps/storefront/src/lib/auth.ts (same bcrypt + signed-JWT-cookie
// approach) but kept as a separate module/cookie/secret since this is a
// distinct app and audience (AdminUser, not Customer).
const SESSION_COOKIE = "aj_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12; // 12 hours — shorter than
// the storefront's 30 days; an admin session left open on a shared
// machine is a bigger risk than a customer one.

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set — see apps/admin/.env.example",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

async function createSessionToken(adminId: string) {
  return new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return typeof payload.adminId === "string" ? payload.adminId : null;
  } catch {
    return null;
  }
}

export async function createSession(adminId: string) {
  const token = await createSessionToken(adminId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionAdminId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export type SessionAdmin = {
  id: string;
  name: string;
  email: string;
};

export async function getCurrentAdmin(): Promise<SessionAdmin | null> {
  const adminId = await getSessionAdminId();
  if (!adminId) return null;

  const admin = await withDbRetry(() =>
    prisma.adminUser.findUnique({
      where: { id: adminId },
      select: { id: true, name: true, email: true },
    }),
  );
  return admin;
}

/**
 * Call at the top of any protected server component/page. Redirects to
 * /login if there's no valid admin session, otherwise returns the admin.
 */
export async function requireAdmin(): Promise<SessionAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");
  return admin;
}
