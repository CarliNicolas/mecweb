import { NextResponse } from "next/server";
import { getChatConfig, buildSystemPrompt } from "@/lib/chat-config";
import { generateText, type ChatMessage } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };
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
