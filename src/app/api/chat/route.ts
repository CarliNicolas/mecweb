import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres el asistente virtual de Emprendimientos MEC S.A. (MECSA), empresa fabricante de sistemas de climatización industrial en Mendoza, Argentina.

EMPRESA:
- Diseñamos e implementamos sistemas de climatización industrial
- Fabricantes de Enfriadores Evaporativos de Alta Eficiencia
- Dirección: Godoy Cruz 562, San José, Guaymallén, Mendoza, Argentina
- Teléfono: +54 261 517-3763
- Email: info@mecsa.com.ar
- Web: mecweb.vercel.app

PRODUCTOS:
1. Enfriadores Evaporativos: hasta 80% menos consumo eléctrico. Toman aire exterior, lo filtran y enfrían por evaporación. Ideal para galpones, fábricas, bodegas.
2. Calefactores Radiantes PIROMEC: tubos radiantes autónomos a gas natural o GLP. Alta eficiencia.
3. Ventilación Industrial: sistemas para industria, comercio y agricultura.
4. Filtración de Aire: filtros absolutos, tratamiento de gases, flujo laminar, recolección de polvos y humedad.
5. Control y Automatización: monitoreo y automatización de climatización.

RUBROS ATENDIDOS:
- Industrial: Bodegas, Fábricas, Galpones, Metalúrgicas, Mineras, Siderúrgicas, Frigoríficos
- Comercial: Locales, Hipermercados, Hoteles, Restaurantes, Hospitales, Clubes
- Particular: Pequeños negocios y hogares

INSTRUCCIONES:
- Responde en el mismo idioma que el usuario
- Sé amigable, profesional y conciso (máximo 3 párrafos)
- Para presupuestos o proyectos específicos, indica que contacten: tel +54 261 517-3763 o email info@mecsa.com.ar
- No inventes precios ni especificaciones técnicas no mencionadas arriba
- Si no sabes algo, dilo honestamente y dirige al contacto directo`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  try {
    const { messages } = await req.json();

    const stream = client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(enc.encode(chunk.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
