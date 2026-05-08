import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import NewsArticleClient from "./NewsArticleClient";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import { newsArticles } from "@/data/news";

async function getAllNews() {
  try {
    const file = path.join(process.cwd(), "src/data/news-admin.json");
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data);
  } catch {
    return newsArticles;
  }
}

export async function generateStaticParams() {
  const articles = await getAllNews();
  return articles.map((a: { slug: string }) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const allNews = await getAllNews();
  const article = allNews.find((a: { slug: string }) => a.slug === slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Emprendimientos MEC S.A.`,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: article.image ? [{ url: article.image }] : [],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const allNews = await getAllNews();
  const article = allNews.find((a: { slug: string }) => a.slug === slug);

  if (!article) notFound();

  const relatedArticles = allNews
    .filter((a: { slug: string; category: string }) => a.category === article.category && a.slug !== slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen">
      <Header />
      <NewsArticleClient article={article} relatedArticles={relatedArticles} />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
