import Link from "next/link";
import { prisma, withDbRetry } from "db";

export const metadata = { title: "Inbox" };

export default async function InboxPage() {
  const conversations = await withDbRetry(() =>
    prisma.conversation.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        customer: { select: { firstName: true, lastName: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
  );

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
      <h1 className="text-2xl font-semibold text-aubergine mb-1">Inbox</h1>
      <p className="text-sm text-charcoal-soft mb-8">
        Messages from customers, most recently active first.
      </p>

      {conversations.length === 0 ? (
        <p className="text-sm text-charcoal-soft bg-white rounded-xl border border-aubergine/10 px-5 py-6 text-center">
          No conversations yet.
        </p>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => {
            const last = c.messages[0];
            return (
              <Link
                key={c.id}
                href={`/inbox/${c.id}`}
                className="flex items-center justify-between gap-4 bg-white rounded-xl border border-aubergine/10 px-5 py-4 hover:border-aubergine/30 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-aubergine truncate">
                    {c.customer.firstName} {c.customer.lastName}
                  </p>
                  {last && (
                    <p className="text-sm text-charcoal-soft truncate mt-0.5">
                      {last.senderAdminId ? "You: " : ""}
                      {last.body}
                    </p>
                  )}
                </div>
                <p className="text-xs text-charcoal-soft shrink-0">
                  {c.updatedAt.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
