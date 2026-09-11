import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { getSessionCustomerId } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public contact form (no login required). Reuses the same
// Conversation/Message tables as the logged-in Messages tab so
// everything lands in one place — apps/admin's Inbox — rather than a
// separate, parallel "contact submissions" list. If the visitor happens
// to be logged in, the message is attached to their account like any
// other conversation instead of being treated as a guest one.
//
// Real limitation, not an oversight: there's no email-sending provider
// wired up anywhere in this project yet (see src/lib/email.ts), so an
// admin reply here is only ever visible if the person comes back and
// checks — for a guest, that means admin has to follow up by actually
// emailing/WhatsApping the address they left, not by relying on the
// in-app reply reaching them.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 },
    );
  }
  if (typeof message !== "string" || message.trim().length < 5) {
    return NextResponse.json(
      { error: "Please write a short message" },
      { status: 400 },
    );
  }

  const customerId = await getSessionCustomerId();

  const conversation = await withDbRetry(() =>
    prisma.conversation.create({
      data: {
        customerId: customerId ?? undefined,
        guestName: customerId ? undefined : name.trim(),
        guestEmail: customerId ? undefined : email.trim().toLowerCase(),
        messages: { create: { body: message.trim() } },
      },
      select: { id: true },
    }),
  );

  return NextResponse.json({ id: conversation.id }, { status: 201 });
}
