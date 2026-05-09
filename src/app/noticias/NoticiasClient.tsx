"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight, Search, Filter } from "lucide-react";
import { StaggerChildren, StaggerItem } from "@/components/ScrollAnimations";

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

const monthNames = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${parseInt(day, 10)} de ${monthNames[parseInt(month, 10) - 1]} de ${year}`;
}

const CATEGORIES = ["Todos", "Proyectos", "Empresa", "Eventos", "Técnico", "Formación"];

export default function NoticiasClient({ initialArticles }: { initialArticles: NewsArticle[] }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = initialArticles.filter((article) => {
    const matchesCategory = selectedCategory === "Todos" || article.category === selectedCategory;
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
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-[var(--mecsa-primary)] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
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
                {initialArticles.length === 0 ? "No hay noticias publicadas" : "No se encontraron noticias"}
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
                          <span>{formatDate(article.date)}</span>
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
                        <span>Leer artículo completo</span>
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
