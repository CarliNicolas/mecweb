// Server-only helper para leer las noticias unificadas (archivo + R2).
// El admin guarda en R2; el archivo del repo es el fallback / seed inicial.
// Las noticias de R2 pisan a las del archivo por slug; las que existen sólo
// en el archivo (deploys nuevos) se prependean.

import "server-only";
import fileNews from "@/data/news-admin.json";
import { readJSON, writeJSON } from "./storage";

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

const KEY = "news.json";

export async function getAllNews(): Promise<NewsArticle[]> {
  const defaults = fileNews as NewsArticle[];
  let stored: NewsArticle[] | null = null;
  try {
    stored = await readJSON<NewsArticle[]>(KEY);
  } catch { /* fall through */ }
  if (!stored) return defaults;
  const storedSlugs = new Set(stored.map((n) => n.slug));
  const fileOnly = defaults.filter((n) => !storedSlugs.has(n.slug));
  return [...fileOnly, ...stored];
}

export async function saveAllNews(news: NewsArticle[]): Promise<void> {
  await writeJSON(KEY, news);
}
