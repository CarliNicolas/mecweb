import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStore } from "@netlify/blobs";
import fs from "fs/promises";
import path from "path";

const NEWS_FILE = path.join(process.cwd(), "src/data/news-admin.json");
const BLOB_KEY = "news";
const BLOB_STORE = "site-data";

interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
}

async function getNewsData(): Promise<NewsArticle[]> {
  try {
    const store = getStore(BLOB_STORE);
    const news = await store.get(BLOB_KEY, { type: "json" });
    if (news) return news as NewsArticle[];
  } catch {
    // Blobs not available, fall through to file
  }
  try {
    const data = await fs.readFile(NEWS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    const { newsArticles } = await import("@/data/news");
    return newsArticles;
  }
}

async function saveNewsData(news: NewsArticle[]) {
  try {
    const store = getStore(BLOB_STORE);
    await store.setJSON(BLOB_KEY, news);
    return;
  } catch {
    // Blobs not available, fall back to filesystem
  }
  const dir = path.dirname(NEWS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(NEWS_FILE, JSON.stringify(news, null, 2));
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const news = await getNewsData();
  return NextResponse.json(news);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const article: NewsArticle = await request.json();
    if (!article.title || !article.excerpt || !article.content) {
      return NextResponse.json({ error: "Campos requeridos: título, extracto y contenido" }, { status: 400 });
    }
    if (!article.slug) {
      article.slug = article.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (!article.date) article.date = new Date().toISOString().split("T")[0];
    const news = await getNewsData();
    if (news.some((n) => n.slug === article.slug)) {
      return NextResponse.json({ error: "Ya existe una noticia con ese slug" }, { status: 400 });
    }
    news.unshift(article);
    await saveNewsData(news);
    return NextResponse.json({ success: true, article });
  } catch {
    return NextResponse.json({ error: "Error al crear la noticia" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const article: NewsArticle = await request.json();
    if (!article.slug) return NextResponse.json({ error: "Slug requerido" }, { status: 400 });
    const news = await getNewsData();
    const index = news.findIndex((n) => n.slug === article.slug);
    if (index === -1) return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
    news[index] = article;
    await saveNewsData(news);
    return NextResponse.json({ success: true, article });
  } catch {
    return NextResponse.json({ error: "Error al actualizar la noticia" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Slug requerido" }, { status: 400 });
    const news = await getNewsData();
    const filtered = news.filter((n) => n.slug !== slug);
    if (filtered.length === news.length) return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
    await saveNewsData(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar la noticia" }, { status: 500 });
  }
}
