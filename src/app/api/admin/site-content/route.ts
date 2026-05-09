import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/site-content.json");
const BLOB_URL_KEY = "mecsa-site-content-url";

async function getSiteContent() {
  // Production: use Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list, head } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "site-content.json" });
      const blob = blobs[0];
      if (blob) {
        const res = await fetch(blob.url);
        if (res.ok) return await res.json();
      }
    } catch { /* fall through */ }
  }
  // Local dev: use filesystem
  try {
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function saveSiteContent(content: Record<string, unknown>) {
  // Production: use Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put, list, del } = await import("@vercel/blob");
    // Delete old blob first
    const { blobs } = await list({ prefix: "site-content.json" });
    for (const blob of blobs) await del(blob.url);
    // Save new blob
    await put("site-content.json", JSON.stringify(content), {
      access: "public",
      contentType: "application/json",
    });
    return;
  }
  // Local dev: use filesystem
  const dir = path.dirname(CONTENT_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const content = await getSiteContent();
  if (!content) {
    return NextResponse.json({ error: "No se pudo leer el contenido" }, { status: 500 });
  }
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    await saveSiteContent(body);
    return NextResponse.json({ success: true, message: "Contenido guardado correctamente" });
  } catch (error) {
    console.error("Error saving site content:", error);
    return NextResponse.json({ error: "Error al guardar el contenido" }, { status: 500 });
  }
}

// Suppress unused import warning
void BLOB_URL_KEY;
