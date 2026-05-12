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
  Linkedin,
  ArrowRight,
  Check,
} from "lucide-react";
import { useState } from "react";
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
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(article.title + " " + shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    if (platform === "instagram") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
      return;
    }

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
                  <div className="flex gap-3 flex-wrap">
                    {/* Facebook */}
                    <button
                      type="button"
                      onClick={() => handleShare("facebook")}
                      className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label="Compartir en Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </button>
                    {/* WhatsApp */}
                    <button
                      type="button"
                      onClick={() => handleShare("whatsapp")}
                      className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label="Compartir por WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </button>
                    {/* Instagram — copia el link */}
                    <button
                      type="button"
                      onClick={() => handleShare("instagram")}
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
                      aria-label="Copiar link para Instagram"
                      title={copied ? "¡Link copiado!" : "Copiar link para Instagram"}
                    >
                      {copied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                      )}
                    </button>
                    {/* LinkedIn */}
                    <button
                      type="button"
                      onClick={() => handleShare("linkedin")}
                      className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label="Compartir en LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      ¡Link copiado! Pegalo en tu historia de Instagram.
                    </p>
                  )}
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
