import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { getSessionCustomerId } from "@/lib/auth";

export async function GET() {
  const customerId = await getSessionCustomerId();
  if (!customerId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // One conversation per customer for now — no "start a new thread"
  // concept, just an ongoing one with the store.
  const conversation = await withDbRetry(() =>
    prisma.conversation.findFirst({
      where: { customerId },
      orderBy: { createdAt: "asc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { senderAdmin: { select: { name: true } } },
        },
      },
    }),
  );

  if (!conversation) {
    return NextResponse.json({ conversation: null });
  }

  return NextResponse.json({
    conversation: {
      id: conversation.id,
      messages: conversation.messages.map((m) => ({
        id: m.id,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
        fromAdmin: Boolean(m.senderAdminId),
        senderName: m.senderAdmin?.name ?? null,
      })),
    },
  });
}
