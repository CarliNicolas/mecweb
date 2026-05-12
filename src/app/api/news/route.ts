import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const NEWS_FILE = path.join(process.cwd(), "src/data/news-admin.json");

export async function GET() {
  let fileNews: { slug: string }[] = [];
  try {
    fileNews = JSON.parse(await fs.readFile(NEWS_FILE, "utf-8"));
  } catch {
    try {
      const { newsArticles } = await import("@/data/news");
      fileNews = newsArticles;
    } catch { /* no fallback */ }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "news.json" });
      const blob = blobs[0];
      if (blob) {
        const res = await fetch(blob.url, {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
        });
        if (res.ok) {
          const blobNews: { slug: string }[] = await res.json();
          const blobSlugs = new Set(blobNews.map((n) => n.slug));
          const fileOnly = fileNews.filter((n) => !blobSlugs.has(n.slug));
          return NextResponse.json([...fileOnly, ...blobNews]);
        }
      }
    } catch { /* fall through */ }
  }

  return NextResponse.json(fileNews);
}
