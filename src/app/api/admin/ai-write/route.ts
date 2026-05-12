import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

const WRITE_SYSTEM = `Eres un redactor profesional para Emprendimientos MEC S.A., empresa de climatización industrial en Mendoza, Argentina. Ayudás a redactar contenido para el sitio web: noticias, artículos técnicos, descripciones de proyectos y novedades de la empresa.

Reglas:
- Respondé SOLO con el texto solicitado, sin explicaciones, aclaraciones ni metacomentarios.
- Tono profesional pero cercano, en español argentino.
- Lenguaje claro, directo y técnicamente correcto en climatización industrial.
- Si te piden un artículo, incluí título y cuerpo. Si te piden solo un título o solo un párrafo, dá solo eso.
- Máximo 400 palabras salvo que se pida más.`;

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "API key no configurada" }, { status: 503 });

  try {
    const { prompt, context } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ error: "Prompt vacío" }, { status: 400 });

    const contextNote = context?.title || context?.category
      ? `\n\nContexto del artículo en edición:\n${context.title ? `- Título actual: ${context.title}` : ""}${context.category ? `\n- Categoría: ${context.category}` : ""}`
      : "";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: WRITE_SYSTEM });
    const result = await model.generateContent(prompt + contextNote);
    const text = result.response.text();

    return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (err) {
    console.error("AI write error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
