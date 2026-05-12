"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, X, Send, Loader2, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

const COTIZAR_KEYWORDS = [
  "cotiz", "presupuest", "precio", "costo", "cuanto", "cuánto",
  "valor", "tarifa", "cobr", "budget", "quote",
];
const wantsCotizar = (text: string) =>
  COTIZAR_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AvatarChat() {
  const t = useTranslations("chat");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | false>(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const openChat = () => {
    setIsOpen(true);
    if (!initialized) {
      setMessages([{ role: "assistant", content: t("welcome") }]);
      setInitialized(true);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setHasError(false);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.status === 503) throw new Error("not_configured");
      if (!res.ok || !res.body) throw new Error("network_error");

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += dec.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: full };
          return updated;
        });
      }
    } catch (err) {
      setHasError(err instanceof Error ? err.message : "network_error");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
        }`}
        style={{ maxHeight: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--mecsa-primary)]">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">{t("title")}</p>
            <p className="text-white/70 text-xs">{t("subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition-colors flex-shrink-0"
            aria-label="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ maxHeight: "360px" }}>
          {messages.map((msg, i) => {
            const prevUserText = i > 0 && messages[i - 1].role === "user" ? messages[i - 1].content : "";
            const showCTA =
              msg.role === "assistant" &&
              msg.content.length > 0 &&
              !isLoading &&
              (wantsCotizar(msg.content) || wantsCotizar(prevUserText));

            return (
              <div key={i}>
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[var(--mecsa-primary)] flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[var(--mecsa-primary)] text-white rounded-br-sm"
                        : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                    {msg.role === "assistant" && msg.content === "" && isLoading && (
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-xs">{t("thinking")}</span>
                      </span>
                    )}
                  </div>
                </div>

                {showCTA && (
                  <div className="flex justify-start mt-2 ml-9">
                    <Link
                      href="/cotizar"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[var(--mecsa-primary)] hover:bg-[var(--mecsa-primary)]/90 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Cotizá tu Proyecto
                    </Link>
                  </div>
                )}
              </div>
            );
          })}

          {hasError && (
            <p className="text-center text-xs text-red-500">
              {hasError === "not_configured"
                ? "⚙️ GEMINI_API_KEY no configurada en Vercel"
                : t("error")}
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("placeholder")}
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--mecsa-primary)]/40 focus:border-[var(--mecsa-primary)] transition-all disabled:opacity-50 max-h-24 overflow-y-auto"
              style={{ lineHeight: "1.4" }}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-[var(--mecsa-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
              aria-label={t("send")}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-2">{t("poweredBy")} · Claude AI</p>
        </div>
      </div>

      {/* Floating button — hidden while chat is open */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <button
            type="button"
            onClick={openChat}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[var(--mecsa-primary)] shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
            aria-label={t("tooltip")}
          >
            <Bot className="w-7 h-7 text-white" />
            <span className="absolute w-full h-full rounded-full bg-[var(--mecsa-primary)] animate-ping opacity-25" />
          </button>
        </div>
      )}
    </>
  );
}
