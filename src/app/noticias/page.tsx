"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ScrollAnimations";
import { Calendar, User, ArrowRight, Search, Filter } from "lucide-react";

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
  const monthIndex = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${monthNames[monthIndex]} de ${year}`;
}

const CATEGORIES = ["Todos", "Proyectos", "Empresa", "Eventos", "Técnico", "Formación"];

export default function NoticiasPage() {
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then(setAllNews)
      .catch(() => {});
  }, []);

  const filteredNews = allNews.filter((article) => {
    const matchesCategory = selectedCategory === "Todos" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-20">
        <section className="bg-[var(--mecsa-primary)] py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Noticias y Novedades</h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Mantente al día con las últimas noticias, proyectos y eventos de MECSA
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar noticias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--mecsa-primary)] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--mecsa-bg)]">
          <div className="max-w-7xl mx-auto">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-500">
                  {allNews.length === 0 ? "Cargando noticias..." : "No se encontraron noticias"}
                </h3>
              </div>
            ) : (
              <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
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
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-[var(--mecsa-primary)] text-white text-xs font-semibold rounded-full">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-[var(--mecsa-text-light)] mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </div>
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--mecsa-text)] mb-3 group-hover:text-[var(--mecsa-primary)] transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="text-[var(--mecsa-text-light)] line-clamp-3 mb-4">{article.excerpt}</p>
                        <div className="flex items-center gap-2 text-[var(--mecsa-primary)] font-medium group-hover:gap-3 transition-all">
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

        <Footer />
      </div>
      <WhatsAppButton />
    </main>
  );
}
