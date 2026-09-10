"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";

type ThreadMessage = {
  id: string;
  body: string;
  createdAt: string;
  fromAdmin: boolean;
  senderName: string | null;
};

const POLL_INTERVAL_MS = 5000;

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessageThread() {
  const [messages, setMessages] = useState<ThreadMessage[] | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchThread() {
    const res = await fetch("/api/conversation");
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.conversation?.messages ?? []);
  }

  useEffect(() => {
    // Fetching on mount (in addition to the poll below) is intentional —
    // shows the existing thread immediately instead of waiting for the
    // first interval tick. Same pattern/justification as the sessionStorage
    // restore in lib/checkout-context.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchThread();
    // Simple polling rather than a live subscription — new replies from
    // the store show up within a few seconds. See the same note on the
    // admin side's ConversationThread component.
    const interval = setInterval(fetchThread, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages?.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;

    setSending(true);
    setError(null);
    setDraft("");
    const res = await fetch("/api/conversation/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    setSending(false);

    if (res.ok) {
      const message = await res.json();
      setMessages((m) => [...(m ?? []), message]);
    } else {
      setDraft(body);
      setError("Couldn't send that message. Please try again.");
    }
  }

  if (messages === null) {
    return (
      <div className="rounded-xl border border-aubergine/10 bg-white h-96 animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col h-[28rem] rounded-xl border border-aubergine/10 bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-charcoal-soft px-6">
            <MessageCircle size={28} className="text-aubergine/30 mb-3" />
            <p className="text-sm">
              Have a question about an order or a fragrance? Send us a
              message and we&apos;ll get back to you here.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.fromAdmin ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.fromAdmin
                    ? "bg-lavender-light/60 text-charcoal rounded-bl-sm"
                    : "bg-aubergine text-cream rounded-br-sm"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    m.fromAdmin ? "text-charcoal-soft" : "text-cream/60"
                  }`}
                >
                  {m.fromAdmin ? m.senderName ?? "AJ Luxe Perfume" : "You"} ·{" "}
                  {formatTime(m.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="text-xs text-red-500 px-5 pt-2">{error}</p>
      )}

      <form
        onSubmit={handleSend}
        className="shrink-0 flex items-center gap-2 border-t border-aubergine/10 p-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
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
