import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllNews, saveAllNews, type NewsArticle } from "@/lib/news-server";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json(await getAllNews());
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
        .toLowerCase().normalize("NFD")
        .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    if (!article.date) article.date = new Date().toISOString().split("T")[0];
    const news = await getAllNews();
    if (news.some((n) => n.slug === article.slug)) {
      return NextResponse.json({ error: "Ya existe una noticia con ese slug" }, { status: 400 });
    }
    news.unshift(article);
    await saveAllNews(news);
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
    const news = await getAllNews();
    const index = news.findIndex((n) => n.slug === article.slug);
    if (index === -1) return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
    news[index] = article;
    await saveAllNews(news);
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
    const news = await getAllNews();
    const filtered = news.filter((n) => n.slug !== slug);
    if (filtered.length === news.length) return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
    await saveAllNews(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar la noticia" }, { status: 500 });
  }
}
