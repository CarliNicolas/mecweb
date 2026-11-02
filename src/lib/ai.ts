// Generación de texto para el chat público y el redactor del admin.
// Usa Gemini si hay GEMINI_API_KEY; si no, Workers AI de Cloudflare (binding AI,
// gratis hasta 10.000 neuronas/día compartidas con la cuenta). Gemma 4 gasta
// ~30-55 neuronas por respuesta (medido en el proyecto Ruffa, oct-2026).

import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WORKERS_AI_MODEL = "@cf/google/gemma-4-26b-a4b-it";

interface WorkersAI {
  run(model: string, input: unknown): Promise<{ response?: string; choices?: { message?: { content?: string } }[] }>;
}

async function workersAI(): Promise<WorkersAI | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as unknown as { AI?: WorkersAI }).AI ?? null;
  } catch {
    return null;
  }
}

export async function generateText(system: string, messages: ChatMessage[]): Promise<string> {
  const turns = messages.filter((m) => m.content.trim() !== "");
  if (turns.length === 0) throw new Error("Sin mensajes");

  if (process.env.GEMINI_API_KEY) {
    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: system,
    });
    // Gemini requiere que el historial arranque con "user"
    const prior = turns.slice(0, -1);
    const firstUser = prior.findIndex((m) => m.role === "user");
    const history = (firstUser >= 0 ? prior.slice(firstUser) : []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const result = await model.startChat({ history }).sendMessage(turns[turns.length - 1].content);
    return result.response.text();
  }

  const ai = await workersAI();
  if (!ai) throw new Error("No hay proveedor de IA configurado");
  const res = await ai.run(WORKERS_AI_MODEL, {
    messages: [{ role: "system", content: system }, ...turns],
    max_completion_tokens: 900,
    temperature: 0.5,
    chat_template_kwargs: { enable_thinking: false },
  });
  return (res.choices?.[0]?.message?.content ?? res.response ?? "").trim();
}
