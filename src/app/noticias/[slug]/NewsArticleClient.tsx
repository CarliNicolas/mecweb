"use client";

import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ScrollAnimations";
import { useTranslations } from "next-intl";
import {
  Calendar,
  User,
  ChevronRight,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import type { NewsArticle } from "@/data/news";

interface NewsArticleClientProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

const monthNames = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  const monthIndex = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${monthNames[monthIndex]} de ${year}`;
}

export default function NewsArticleClient({
  article,
  relatedArticles,
}: NewsArticleClientProps) {
  const t = useTranslations("news");
  const tCommon = useTranslations("common");
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Image */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative h-full flex items-end z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
            <FadeIn>
              {/* Breadcrumb */}
              <nav className="text-white/70 text-sm mb-4 flex items-center gap-2">
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/noticias" className="hover:text-white transition-colors">
                  {t("title")}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white truncate max-w-[200px]">{article.title}</span>
              </nav>

              {/* Category */}
              <span className="inline-block px-4 py-1.5 bg-[var(--mecsa-primary)] text-white text-sm font-semibold rounded-full mb-4">
                {article.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(article.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{article.author}</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_200px] gap-12">
            {/* Main Content */}
            <FadeIn>
              <article className="prose prose-lg max-w-none">
                {/* Excerpt as lead paragraph */}
                <p className="text-xl text-[var(--mecsa-text)] font-medium leading-relaxed mb-8 border-l-4 border-[var(--mecsa-primary)] pl-6">
                  {article.excerpt}
                </p>

                {/* Content */}
                <div className="text-[var(--mecsa-text-light)] leading-relaxed space-y-6">
                  {article.content.split("\n\n").map((paragraph, index) => {
                    // Check if paragraph is a heading (starts with **)
                    if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                      return (
                        <h3
                          key={`para-${index}`}
                          className="text-xl font-semibold text-[var(--mecsa-text)] mt-8 mb-4"
                        >
                          {paragraph.replace(/\*\*/g, "")}
                        </h3>
                      );
                    }

                    // Check for bullet points
                    if (paragraph.includes("\n- ")) {
                      const lines = paragraph.split("\n");
                      const title = lines[0];
                      const items = lines.slice(1).filter((l) => l.startsWith("- "));

                      return (
                        <div key={`para-${index}`}>
                          {title && (
                            <h4 className="text-lg font-semibold text-[var(--mecsa-text)] mb-3">
                              {title.replace(/\*\*/g, "")}
                            </h4>
                          )}
                          <ul className="list-disc list-inside space-y-2 ml-4">
                            {items.map((item, i) => (
                              <li key={`item-${i}`} className="text-[var(--mecsa-text-light)]">
                                {item.replace("- ", "")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    return (
                      <p key={`para-${index}`} className="text-[var(--mecsa-text-light)]">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </article>
            </FadeIn>

            {/* Sidebar */}
            <FadeIn direction="right" delay={0.2}>
              <aside className="lg:sticky lg:top-24">
                {/* Share */}
                <div className="bg-[var(--mecsa-bg)] rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-[var(--mecsa-text)] mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Compartir
                  </h4>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleShare("facebook")}
                      className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label="Compartir en Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare("twitter")}
                      className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label="Compartir en Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare("linkedin")}
                      className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label="Compartir en LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Back to News */}
                <Link
                  href="/noticias"
                  className="flex items-center gap-2 text-[var(--mecsa-primary)] hover:gap-3 transition-all font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("back")}
                </Link>
              </aside>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--mecsa-bg)]">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <h2 className="mecsa-section-title text-center mb-12">
                Artículos Relacionados
              </h2>
            </FadeIn>

            <StaggerChildren className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
              {relatedArticles.map((related) => (
                <StaggerItem key={related.slug}>
                  <Link
                    href={`/noticias/${related.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm text-[var(--mecsa-text-light)] mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(related.date)}</span>
                      </div>
                      <h3 className="font-semibold text-[var(--mecsa-text)] group-hover:text-[var(--mecsa-primary)] transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--mecsa-primary)]">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              ¿Tiene un proyecto en mente?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Contáctenos y le ayudaremos a encontrar la mejor solución de climatización
              para su empresa.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[var(--mecsa-primary)] font-semibold rounded-sm hover:bg-gray-100 transition-colors group"
            >
              <span>Solicitar presupuesto</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
