import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const NEWS_FILE = path.join(process.cwd(), "src/data/news-admin.json");

export async function GET() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "news.json" });
      const blob = blobs[0];
      if (blob) {
        const res = await fetch(blob.url, {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
        });
        if (res.ok) return NextResponse.json(await res.json());
      }
    } catch { /* fall through */ }
  }
  try {
    const data = await fs.readFile(NEWS_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    const { newsArticles } = await import("@/data/news");
    return NextResponse.json(newsArticles);
  }
}
