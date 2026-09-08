import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "../generated/prisma/enums";

// Retries a Prisma call once (with a short delay) on transient connection
// errors — e.g. Supabase's pooled connection taking a moment to respond
// after being idle. Non-transient errors (validation, not-found, etc.)
// are rethrown immediately without retrying.
const RETRYABLE_PRISMA_CODES = new Set(["P1001", "P1002", "P1017"]);

export async function withDbRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 400,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const code = (error as { code?: string } | undefined)?.code;
      const isLastAttempt = attempt === attempts - 1;
      if (!code || !RETRYABLE_PRISMA_CODES.has(code) || isLastAttempt) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  throw lastError;
}
