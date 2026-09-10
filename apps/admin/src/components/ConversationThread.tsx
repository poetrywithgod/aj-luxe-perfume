"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

export type ThreadMessage = {
  id: string;
  body: string;
  createdAt: string;
  fromAdmin: boolean;
  senderName: string | null;
};

const POLL_INTERVAL_MS = 5000;

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ConversationThread({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: ThreadMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Simple polling rather than a live Supabase Realtime subscription —
  // gets new messages onto the screen within a few seconds without the
  // extra realtime-channel wiring. Worth upgrading to Realtime later if
  // the inbox sees enough volume that a few seconds' lag actually matters.
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;

    setSending(true);
    setDraft("");
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setSending(false);

    if (res.ok) {
      const message = await res.json();
      setMessages((m) => [...m, message]);
    } else {
      setDraft(body); // put it back so the reply isn't lost
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-aubergine/10 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-charcoal-soft text-center py-10">
            No messages yet.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.fromAdmin ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.fromAdmin
                    ? "bg-aubergine text-cream rounded-br-sm"
                    : "bg-lavender-light/60 text-charcoal rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    m.fromAdmin ? "text-cream/60" : "text-charcoal-soft"
                  }`}
                >
                  {m.fromAdmin ? m.senderName ?? "Admin" : "Customer"} ·{" "}
                  {formatTime(m.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="shrink-0 flex items-center gap-2 border-t border-aubergine/10 p-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a reply..."
          className="flex-1 rounded-full border border-aubergine/15 bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="shrink-0 w-10 h-10 rounded-full bg-aubergine text-cream flex items-center justify-center hover:bg-aubergine-light transition-colors disabled:opacity-50"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
