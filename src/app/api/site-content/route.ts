import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "src/data/site-content.json");

export async function GET() {
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
          return NextResponse.json(fileData ? { ...fileData, ...blobData } : blobData);
        }
      }
    } catch { /* fall through */ }
  }

  if (fileData) return NextResponse.json(fileData);
  return NextResponse.json({ error: "No se pudo leer el contenido" }, { status: 500 });
}
