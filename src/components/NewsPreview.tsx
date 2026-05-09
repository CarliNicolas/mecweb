"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, ChevronRight } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "./ScrollAnimations";
import { NewsCardSkeleton } from "./Skeleton";
import { useTranslations, useLocale } from "next-intl";

interface NewsArticle {
  slug: string; title: string; excerpt: string;
  image: string; date: string; category: string; author: string;
}

const monthNames: Record<string, string[]> = {
  es: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  pt: ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],
};

function formatDate(dateString: string, locale: string): string {
  const [year, month, day] = dateString.split("-");
  const months = monthNames[locale] ?? monthNames.es;
  if (locale === "en") return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  return `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]} de ${year}`;
}

export default function NewsPreview() {
  const t = useTranslations("news");
  const locale = useLocale();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data: NewsArticle[]) => { setNews(data.slice(0, 3)); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  if (!isLoading && news.length === 0) return null;

  return (
    <section id="noticias" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="mecsa-section-title mb-4">{t("latestNews")}</h2>
            <p className="text-[var(--mecsa-text-light)] max-w-2xl mx-auto">
              {t("latestNewsSubtitle")}
            </p>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => <NewsCardSkeleton key={i} />)}
          </div>
        ) : (
          <StaggerChildren className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {news.map((article) => (
              <StaggerItem key={article.slug}>
                <Link href={`/noticias/${article.slug}`}
                  className="group block bg-[var(--mecsa-bg)] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={article.image} alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[var(--mecsa-primary)] text-white text-xs font-semibold rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-[var(--mecsa-text-light)] mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.date, locale)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--mecsa-text)] mb-3 group-hover:text-[var(--mecsa-primary)] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[var(--mecsa-text-light)] line-clamp-3 mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-2 text-[var(--mecsa-primary)] font-medium text-sm group-hover:gap-3 transition-all">
                      <span>{t("readMoreShort")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}

        <FadeIn delay={0.4}>
          <div className="text-center mt-12">
            <Link href="/noticias" className="mecsa-btn inline-flex items-center gap-2 group">
              <span>{t("viewAll")}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
