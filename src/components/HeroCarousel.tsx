"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations, useLocale } from "next-intl";
import { renderInline } from "@/lib/inline-markdown";

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function HeroCarousel() {
  const { content } = useSiteContent();
  const t = useTranslations("hero");
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const translatedSlides = [
    {
      image: content.heroSlides[0]?.image || "/images/hero1.jpeg",
      title: t("ventilation"),
      titleHighlight: t("industrial"),
      subtitle: t("ventilationSubtitle"),
    },
    {
      image: content.heroSlides[1]?.image || "/images/hero2.jpeg",
      title: t("climatization"),
      titleHighlight: t("industrial"),
      subtitle: t("climatizationSubtitle"),
    },
    {
      image: content.heroSlides[2]?.image || "/images/hero3.jpeg",
      title: t("filtration"),
      titleHighlight: t("air"),
      subtitle: t("filtrationSubtitle"),
    },
  ];

  const slides =
    locale === "es" && content.heroSlides.length > 0
      ? content.heroSlides
      : translatedSlides;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isPaused || reducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 800);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isPaused, reducedMotion]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const kenBurns = !reducedMotion;

  return (
    <section
      aria-roledescription="carrusel"
      aria-label={t("carouselLabel") || "Presentación de servicios"}
      className="relative h-[480px] sm:h-[580px] md:h-[700px] overflow-hidden bg-neutral-900"
    >
      {slides.map((slide, index) => (
        <div
          key={`slide-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={index !== currentSlide}
        >
          <div className="absolute inset-0 overflow-hidden">
            {isExternalUrl(slide.image) ? (
              <img
                src={slide.image}
                alt={`${slide.title} ${slide.titleHighlight}`}
                className={`w-full h-full object-cover ${
                  kenBurns
                    ? `transition-transform duration-[8000ms] ease-out ${index === currentSlide ? "scale-110" : "scale-100"}`
                    : ""
                }`}
              />
            ) : (
              <Image
                src={slide.image}
                alt={`${slide.title} ${slide.titleHighlight}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover ${
                  kenBurns
                    ? `transition-transform duration-[8000ms] ease-out ${index === currentSlide ? "scale-110" : "scale-100"}`
                    : ""
                }`}
              />
            )}
            <div className="absolute inset-0 bg-black/35" />
          </div>

          <div className="relative h-full flex items-center z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div
                className={`max-w-lg transition-all duration-700 ${
                  index === currentSlide ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
                style={{ transitionDelay: index === currentSlide ? "300ms" : "0ms" }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3 sm:mb-4">
                  <span className="font-light">{slide.title}</span>{" "}
                  <span className="font-light italic text-[var(--mecsa-primary)]">
                    {slide.titleHighlight}
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">{renderInline(slide.subtitle)}</p>
                <Link href="#empresa" className="mecsa-btn inline-block">
                  {t("learnMore")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={prevSlide} type="button" aria-label={t("prevSlide")}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-20">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={nextSlide} type="button" aria-label={t("nextSlide")}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-20">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button key={`dot-${index}`} type="button" onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-[var(--mecsa-primary)] scale-125" : "bg-white/50"
              }`}
              aria-label={`${t("goToSlide")} ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Reanudar carrusel" : "Pausar carrusel"}
            aria-pressed={isPaused}
            className="ml-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </section>
  );
}
