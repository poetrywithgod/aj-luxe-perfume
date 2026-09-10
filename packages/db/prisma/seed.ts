import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/client";

// Creates (or updates the password for) the first AdminUser so there's
// someone who can actually log into apps/admin. Run with:
//   pnpm --filter db db:seed
// Reads ADMIN_SEED_EMAIL / ADMIN_SEED_NAME / ADMIN_SEED_PASSWORD from the
// environment (put them in packages/db/.env alongside DATABASE_URL —
// dotenv/config above loads that file) rather than hardcoding a default
// password here.

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const name = process.env.ADMIN_SEED_NAME;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !name || !password) {
    console.error(
      "Missing ADMIN_SEED_EMAIL, ADMIN_SEED_NAME, or ADMIN_SEED_PASSWORD.\n" +
        "Add them to packages/db/.env, e.g.:\n" +
        "  ADMIN_SEED_EMAIL=you@ajluxe.com\n" +
        "  ADMIN_SEED_NAME=Your Name\n" +
        "  ADMIN_SEED_PASSWORD=a-strong-password",
    );
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("ADMIN_SEED_PASSWORD should be at least 12 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const normalizedEmail = email.trim().toLowerCase();

  const admin = await prisma.adminUser.upsert({
    where: { email: normalizedEmail },
    update: { name, passwordHash },
    create: { email: normalizedEmail, name, passwordHash },
  });

  console.log(`Admin user ready: ${admin.email} (${admin.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
