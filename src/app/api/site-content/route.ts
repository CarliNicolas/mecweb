import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/site-content.json");

export async function GET() {
  // Production: use Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "site-content.json" });
      const blob = blobs[0];
      if (blob) {
        const res = await fetch(blob.url);
        if (res.ok) return NextResponse.json(await res.json());
      }
    } catch { /* fall through to file */ }
  }
  // Local dev or fallback: use filesystem
  try {
    const data = await fs.readFile(CONTENT_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "No se pudo leer el contenido" }, { status: 500 });
  }
}
