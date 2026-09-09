import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { prisma, withDbRetry } from "db";

export const metadata: Metadata = {
  title: "Confirm Email Change",
  robots: { index: false },
};

function Result({
  ok,
  heading,
  message,
}: {
  ok: boolean;
  heading: string;
  message: string;
}) {
  const Icon = ok ? CheckCircle2 : XCircle;
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-20 text-center">
      <Icon
        size={48}
        className={ok ? "mx-auto text-magenta-deep mb-6" : "mx-auto text-red-400 mb-6"}
      />
      <h1 className="font-display text-2xl text-aubergine mb-3">{heading}</h1>
      <p className="text-charcoal-soft mb-8">{message}</p>
      <Link
        href="/account"
        className="inline-flex items-center rounded-lg bg-aubergine text-cream text-sm font-medium px-6 py-3 hover:bg-aubergine-light transition-colors"
      >
        Back to My Account
      </Link>
    </div>
  );
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Result
        ok={false}
        heading="Missing verification link"
        message="This link is incomplete. Please use the link from the confirmation email, or request the email change again from your account settings."
      />
    );
  }

  const customer = await withDbRetry(() =>
    prisma.customer.findUnique({ where: { emailVerifyToken: token } }),
  );

  if (!customer || !customer.pendingEmail || !customer.emailVerifyExpires) {
    return (
      <Result
        ok={false}
        heading="Link not valid"
        message="This verification link has already been used, or doesn't match a pending email change."
      />
    );
  }

  if (customer.emailVerifyExpires < new Date()) {
    return (
      <Result
        ok={false}
        heading="Link expired"
        message="This verification link has expired. Please request the email change again from your account settings."
      />
    );
  }

  await withDbRetry(() =>
    prisma.customer.update({
      where: { id: customer.id },
      data: {
        email: customer.pendingEmail!,
        pendingEmail: null,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    }),
  );

  return (
    <Result
      ok
      heading="Email confirmed"
      message={`Your account email is now ${customer.pendingEmail}.`}
    />
  );
}
