import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import { getCurrentAdmin } from "@/lib/auth";

type MessageDTO = {
  id: string;
  body: string;
  createdAt: string;
  fromAdmin: boolean;
  senderName: string | null;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const { id } = await params;

  const messages = await withDbRetry(() =>
    prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
      include: { senderAdmin: { select: { name: true } } },
    }),
  );

  const dto: MessageDTO[] = messages.map((m) => ({
    id: m.id,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
    fromAdmin: Boolean(m.senderAdminId),
    senderName: m.senderAdmin?.name ?? null,
  }));

  return NextResponse.json({ messages: dto });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const { id } = await params;

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

  const conversation = await withDbRetry(() =>
    prisma.conversation.findUnique({ where: { id }, select: { id: true } }),
  );
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const [message] = await withDbRetry(() =>
    prisma.$transaction([
      prisma.message.create({
        data: { conversationId: id, body: text.trim(), senderAdminId: admin.id },
        include: { senderAdmin: { select: { name: true } } },
      }),
      // Message creation doesn't touch Conversation.updatedAt on its own
      // (no direct write to that row) — bump it explicitly so the Inbox
      // list sorts by actual recent activity.
      prisma.conversation.update({
        where: { id },
        data: { updatedAt: new Date() },
      }),
    ]),
  );

  const dto: MessageDTO = {
    id: message.id,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
    fromAdmin: true,
    senderName: message.senderAdmin?.name ?? null,
  };

  return NextResponse.json(dto, { status: 201 });
}
