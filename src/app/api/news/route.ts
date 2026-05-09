import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import fs from "fs/promises";
import path from "path";

const NEWS_FILE = path.join(process.cwd(), "src/data/news-admin.json");
const BLOB_KEY = "news";
const BLOB_STORE = "site-data";

export async function GET() {
  try {
    if (process.env.NETLIFY) {
      try {
        const store = getStore(BLOB_STORE);
        const news = await store.get(BLOB_KEY, { type: "json" });
        if (news) return NextResponse.json(news);
      } catch {
        // fall through
      }
    }
    const data = await fs.readFile(NEWS_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    const { newsArticles } = await import("@/data/news");
    return NextResponse.json(newsArticles);
  }
}
