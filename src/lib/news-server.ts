// Server-only helper para leer las noticias unificadas (archivo + Vercel Blob).
// El admin guarda en Blob; el archivo del repo es el fallback / seed inicial.
// Las noticias del Blob pisan a las del archivo por slug; las que existen sólo
// en el archivo (deploys nuevos) se prependean.

import "server-only";
import fs from "fs/promises";
import path from "path";

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
}

const NEWS_FILE = path.join(process.cwd(), "src/data/news-admin.json");

export async function getAllNews(): Promise<NewsArticle[]> {
  let fileNews: NewsArticle[] = [];
  try {
    fileNews = JSON.parse(await fs.readFile(NEWS_FILE, "utf-8"));
  } catch {
    try {
      const { newsArticles } = await import("@/data/news");
      fileNews = newsArticles as NewsArticle[];
    } catch { /* sin fallback */ }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "news.json" });
      const blob = blobs[0];
      if (blob) {
        const res = await fetch(blob.url, {
          headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
          cache: "no-store",
        });
        if (res.ok) {
          const blobNews: NewsArticle[] = await res.json();
          const blobSlugs = new Set(blobNews.map((n) => n.slug));
          const fileOnly = fileNews.filter((n) => !blobSlugs.has(n.slug));
          return [...fileOnly, ...blobNews];
        }
      }
    } catch { /* fall through */ }
  }
  return fileNews;
}
