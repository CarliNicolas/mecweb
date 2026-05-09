import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { FadeIn } from "@/components/ScrollAnimations";
import NoticiasClient from "./NoticiasClient";

async function getNews() {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("site-data");
    const news = await store.get("news", { type: "json" });
    if (news) return news as NewsArticle[];
  } catch {
    // Blobs not available, fall through to static data
  }
  try {
    const { newsArticles } = await import("@/data/news");
    return newsArticles;
  } catch {
    return [];
  }
}

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

export default async function NoticiasPage() {
  const articles = await getNews();

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 sm:pt-20">
        <section className="bg-[var(--mecsa-primary)] py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-3 sm:mb-4">
                Noticias y Novedades
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Mantente al día con las últimas noticias, proyectos y eventos de MECSA
              </p>
            </FadeIn>
          </div>
        </section>

        <NoticiasClient initialArticles={articles as NewsArticle[]} />

        <Footer />
      </div>
      <WhatsAppButton />
    </main>
  );
}
