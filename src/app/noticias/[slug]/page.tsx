import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import NewsArticleClient from "./NewsArticleClient";
import { notFound } from "next/navigation";
import { getAllNews } from "@/lib/news-server";

export const dynamic = "force-dynamic";

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
    alternates: { canonical: `/noticias/${slug}` },
    openGraph: {
      title: `${article.title} | Emprendimientos MEC S.A.`,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: article.image
        ? [{ url: article.image, alt: article.title }]
        : [{ url: "/images/climatizacion-en-galpones-1155x770.jpg", alt: "Emprendimientos MEC S.A." }],
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
