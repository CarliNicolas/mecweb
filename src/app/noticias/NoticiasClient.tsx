"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight, Search, Filter } from "lucide-react";
import { StaggerChildren, StaggerItem } from "@/components/ScrollAnimations";
import { useTranslations, useLocale } from "next-intl";

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

const monthNames: Record<string, string[]> = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
};

function formatDate(dateString: string, locale: string): string {
  const [year, month, day] = dateString.split("-");
  const months = monthNames[locale] ?? monthNames.es;
  if (locale === "en") return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  return `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]} de ${year}`;
}

const CATEGORY_KEYS = [
  { key: "allCategories", value: "Todos" },
  { key: "categories.projects", value: "Proyectos" },
  { key: "categories.company", value: "Empresa" },
  { key: "categories.events", value: "Eventos" },
  { key: "categories.technical", value: "Técnico" },
  { key: "categories.training", value: "Formación" },
] as const;

export default function NoticiasClient({ initialArticles }: { initialArticles: NewsArticle[] }) {
  const t = useTranslations("news");
  const locale = useLocale();

  const [selectedValue, setSelectedValue] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = initialArticles.filter((article) => {
    const matchesCategory = selectedValue === "Todos" || article.category === selectedValue;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Filter bar */}
      <section className="py-5 sm:py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_KEYS.map(({ key, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedValue(value)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedValue === value
                      ? "bg-[var(--mecsa-primary)] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(key as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[var(--mecsa-bg)]">
        <div className="max-w-7xl mx-auto">
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl text-gray-500">
                {initialArticles.length === 0 ? t("noPublished") : t("noResults")}
              </h3>
            </div>
          ) : (
            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" staggerDelay={0.1}>
              {filteredNews.map((article) => (
                <StaggerItem key={article.slug}>
                  <Link
                    href={`/noticias/${article.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <span className="px-2 sm:px-3 py-1 bg-[var(--mecsa-primary)] text-white text-xs font-semibold rounded-full">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[var(--mecsa-text-light)] mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{formatDate(article.date, locale)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{article.author}</span>
                        </div>
                      </div>
                      <h2 className="text-base sm:text-xl font-semibold text-[var(--mecsa-text)] mb-2 sm:mb-3 group-hover:text-[var(--mecsa-primary)] transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-[var(--mecsa-text-light)] text-sm line-clamp-3 mb-4">{article.excerpt}</p>
                      <div className="flex items-center gap-2 text-[var(--mecsa-primary)] text-sm font-medium group-hover:gap-3 transition-all">
                        <span>{t("readMore")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </section>
    </>
  );
}
