import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/site-content-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getSiteContent();
  if (content) return NextResponse.json(content);
  return NextResponse.json({ error: "No se pudo leer el contenido" }, { status: 500 });
}
