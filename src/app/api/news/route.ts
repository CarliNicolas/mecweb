import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const NEWS_FILE = path.join(process.cwd(), "src/data/news-admin.json");

export async function GET() {
  try {
    const data = await fs.readFile(NEWS_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    // Fallback to static data
    const { newsArticles } = await import("@/data/news");
    return NextResponse.json(newsArticles);
  }
}
