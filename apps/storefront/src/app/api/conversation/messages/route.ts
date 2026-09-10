import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { getSessionCustomerId } from "@/lib/auth";

export async function POST(request: Request) {
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

  const { body: text } = (body ?? {}) as Record<string, unknown>;
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Message can't be empty" }, { status: 400 });
  }

  const message = await withDbRetry(async () => {
    // Find-or-create the customer's one ongoing conversation, then add
    // the message to it, in a single transaction.
    let conversation = await prisma.conversation.findFirst({
      where: { customerId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { customerId },
        select: { id: true },
      });
    }

    const [created] = await prisma.$transaction([
      prisma.message.create({
        data: { conversationId: conversation.id, body: text.trim() },
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      }),
    ]);

    return created;
  });

  return NextResponse.json(
    {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
      fromAdmin: false,
      senderName: null,
    },
    { status: 201 },
  );
}
