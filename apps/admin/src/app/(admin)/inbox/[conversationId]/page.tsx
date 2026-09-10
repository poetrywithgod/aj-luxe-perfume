import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma, withDbRetry } from "db";
import { getCurrentAdmin } from "@/lib/auth";
import { ConversationThread } from "@/components/ConversationThread";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const admin = await getCurrentAdmin();
  if (!admin) notFound(); // layout already guards this; just for TS narrowing

  const conversation = await withDbRetry(() =>
    prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: { senderAdmin: { select: { name: true } } },
        },
      },
    }),
  );

  if (!conversation) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10 flex flex-col h-screen">
      <div className="shrink-0 mb-6">
        <Link
          href="/inbox"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-soft hover:text-aubergine transition-colors mb-4"
        >
          <ArrowLeft size={15} /> Inbox
        </Link>
        <h1 className="text-xl font-semibold text-aubergine">
          {conversation.customer.firstName} {conversation.customer.lastName}
        </h1>
        <p className="text-sm text-charcoal-soft">
          {conversation.customer.email}
        </p>
      </div>

      <ConversationThread
        conversationId={conversation.id}
        initialMessages={conversation.messages.map((m) => ({
          id: m.id,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
          fromAdmin: Boolean(m.senderAdminId),
          senderName: m.senderAdmin?.name ?? null,
        }))}
      />
    </div>
  );
}
