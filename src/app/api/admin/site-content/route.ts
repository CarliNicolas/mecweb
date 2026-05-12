import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/site-content.json");

async function getSiteContent() {
  let fileData: Record<string, unknown> | null = null;
  try {
    fileData = JSON.parse(await fs.readFile(CONTENT_FILE, "utf-8"));
  } catch { /* file may not exist */ }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "site-content.json" });
      const blob = blobs[0];
      if (blob) {
        const res = await fetch(blob.url, {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
        });
        if (res.ok) {
          const blobData = await res.json();
          // File provides defaults for new fields; Blob preserves admin edits
          return fileData ? { ...fileData, ...blobData } : blobData;
        }
      }
    } catch { /* fall through to file */ }
  }
  return fileData;
}

async function saveSiteContent(content: Record<string, unknown>) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put, list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "site-content.json" });
    for (const blob of blobs) await del(blob.url);
    await put("site-content.json", JSON.stringify(content), {
      access: "private",
      contentType: "application/json",
    });
    return;
  }
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
