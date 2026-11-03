import { NextResponse } from "next/server";
import { getChatConfig, buildSystemPrompt } from "@/lib/chat-config";
import { generateText, type ChatMessage } from "@/lib/ai";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";

const MAX_MESSAGES = 12;
const MAX_CHARS = 1500;

export async function POST(req: Request) {
  if (await isRateLimited("CHAT_LIMITER", req)) return tooManyRequests();
  try {
    const body = (await req.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }
    // Solo los últimos turnos, roles conocidos y textos acotados
    const messages: ChatMessage[] = body.messages
      .slice(-MAX_MESSAGES)
      .filter((m): m is ChatMessage =>
        typeof m === "object" && m !== null &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string")
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const config = await getChatConfig();
    const text = await generateText(buildSystemPrompt(config), messages);
    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Chat API error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
