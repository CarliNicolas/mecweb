import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getChatConfig, buildSystemPrompt } from "@/lib/chat-config";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  try {
    const { messages } = await req.json();

    const config = await getChatConfig();
    const systemPrompt = buildSystemPrompt(config);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // Gemini requires history to start with "user", drop any leading assistant messages
    const allButLast = messages.slice(0, -1).filter(
      (m: { role: string; content: string }) => m.content.trim() !== ""
    );
    const firstUserIdx = allButLast.findIndex(
      (m: { role: string; content: string }) => m.role === "user"
    );
    const validHistory = firstUserIdx >= 0 ? allButLast.slice(firstUserIdx) : [];
    const history = validHistory.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Chat API error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
