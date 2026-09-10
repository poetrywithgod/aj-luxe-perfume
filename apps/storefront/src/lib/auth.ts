import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma, withDbRetry } from "db";

const SESSION_COOKIE = "aj_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Fail loudly rather than silently falling back to a guessable
    // default — a hardcoded fallback secret would make every session
    // forgeable. See .env.example for how to set this.
    throw new Error(
      "SESSION_SECRET is not set — see apps/storefront/.env.example",
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

async function createSessionToken(customerId: string) {
  return new SignJWT({ customerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return typeof payload.customerId === "string" ? payload.customerId : null;
  } catch {
    return null;
  }
}

export async function createSession(customerId: string) {
  const token = await createSessionToken(customerId);
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

export async function getSessionCustomerId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// Public shape returned to the client — never includes passwordHash.
export type SessionCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: Date;
  // Set while a change-of-email confirmation is pending (see
  // src/lib/email.ts + /account/verify-email) — the real `email` above
  // stays the old, still-valid address until this is confirmed.
  pendingEmail: string | null;
};

export async function getCurrentCustomer(): Promise<SessionCustomer | null> {
  const customerId = await getSessionCustomerId();
  if (!customerId) return null;

  const customer = await withDbRetry(() =>
    prisma.customer.findUnique({ where: { id: customerId } }),
  );
  if (!customer) return null;

  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt,
    pendingEmail: customer.pendingEmail,
  };
}

// Lighter lookup for places (like the headers) that only need a name to
// display and shouldn't pay for/depend on the full account fetch above.
export type SessionIdentity = {
  firstName: string;
  lastName: string;
};

export async function getCurrentIdentity(): Promise<SessionIdentity | null> {
  const customerId = await getSessionCustomerId();
  if (!customerId) return null;

  const customer = await withDbRetry(() =>
    prisma.customer.findUnique({
      where: { id: customerId },
      select: { firstName: true, lastName: true },
    }),
  );
  return customer;
}

// --- Login lockout -----------------------------------------------------
// Per-account (not per-IP — no Redis/Upstash or similar is set up for
// this project). Five failed password checks locks the account out for
// 15 minutes; a successful login clears the counter.
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_MINUTES = 15;

export async function registerFailedLogin(customerId: string) {
  const customer = await withDbRetry(() =>
    prisma.customer.update({
      where: { id: customerId },
      data: { failedLoginAttempts: { increment: 1 } },
      select: { failedLoginAttempts: true },
    }),
  );

  if (customer.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
    await withDbRetry(() =>
      prisma.customer.update({
        where: { id: customerId },
        data: {
          lockedUntil: new Date(Date.now() + LOGIN_LOCKOUT_MINUTES * 60_000),
        },
      }),
    );
  }
}

export async function clearFailedLogins(customerId: string) {
  await withDbRetry(() =>
    prisma.customer.update({
      where: { id: customerId },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    }),
  );
}
