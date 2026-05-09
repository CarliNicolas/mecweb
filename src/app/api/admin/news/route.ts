import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const NEWS_FILE = path.join(process.cwd(), "src/data/news-admin.json");

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
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "news.json" });
      const blob = blobs[0];
      if (blob) {
        const res = await fetch(blob.url);
        if (res.ok) return await res.json();
      }
    } catch { /* fall through */ }
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
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put, list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "news.json" });
    for (const blob of blobs) await del(blob.url);
    await put("news.json", JSON.stringify(news), {
      access: "public",
      contentType: "application/json",
    });
    return;
  }
  const dir = path.dirname(NEWS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(NEWS_FILE, JSON.stringify(news, null, 2));
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json(await getNewsData());
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
