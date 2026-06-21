import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { FadeIn } from "@/components/ScrollAnimations";
import NoticiasClient from "./NoticiasClient";
import { getTranslations } from "next-intl/server";
import { getAllNews, type NewsArticle } from "@/lib/news-server";

export const dynamic = "force-dynamic";

export default async function NoticiasPage() {
  const articles = await getAllNews();
  const t = await getTranslations("news");

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 sm:pt-20">
        <section className="bg-[var(--mecsa-primary)] py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-3 sm:mb-4">
                {t("title")}
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                {t("subtitle")}
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
