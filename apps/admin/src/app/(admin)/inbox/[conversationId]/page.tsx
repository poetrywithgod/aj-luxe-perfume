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

  const displayName = conversation.customer
    ? `${conversation.customer.firstName} ${conversation.customer.lastName}`
    : (conversation.guestName ?? "Guest");
  const displayEmail = conversation.customer?.email ?? conversation.guestEmail;

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10 flex flex-col h-screen">
      <div className="shrink-0 mb-6">
        <Link
          href="/inbox"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-soft hover:text-aubergine transition-colors mb-4"
        >
          <ArrowLeft size={15} /> Inbox
        </Link>
        <h1 className="text-xl font-semibold text-aubergine flex items-center gap-2">
          {displayName}
          {!conversation.customer && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-gold bg-gold/10 border border-gold/30 rounded-full px-2 py-0.5">
              Guest
            </span>
          )}
        </h1>
        {displayEmail && (
          <p className="text-sm text-charcoal-soft">{displayEmail}</p>
        )}
        {!conversation.customer && (
          <p className="text-xs text-charcoal-soft mt-1">
            Submitted via the Contact page — no account, so a reply here
            won&apos;t reach them. Follow up directly at the email above.
          </p>
        )}
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
