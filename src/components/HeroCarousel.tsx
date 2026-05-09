"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const defaultSlides = [
  { image: "/images/hero1.jpeg", title: "Ventilación", titleHighlight: "Industrial", subtitle: "Sistemas de Ventilación y Diseño de proyectos a medida." },
  { image: "/images/hero2.jpeg", title: "Climatización", titleHighlight: "Industrial", subtitle: "Sistemas de Climatización y Diseño de proyectos a medida." },
  { image: "/images/hero3.jpeg", title: "Filtración de", titleHighlight: "Aire", subtitle: "Sistemas de Filtración de Aire y Diseño de proyectos a medida." },
];

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function HeroCarousel() {
  const { content } = useSiteContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = content.heroSlides.length > 0 ? content.heroSlides : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 800);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

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

  return (
    <section className="relative h-[480px] sm:h-[580px] md:h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={`slide-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image — Ken Burns zoom on active slide */}
          <div className="absolute inset-0 overflow-hidden">
            {isExternalUrl(slide.image) ? (
              // External URLs: use img tag (next/image needs width/height for external)
              <img
                src={slide.image}
                alt={`${slide.title} ${slide.titleHighlight}`}
                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                  index === currentSlide ? "scale-110" : "scale-100"
                }`}
              />
            ) : (
              // Local images: use next/image with fill for optimization
              <Image
                src={slide.image}
                alt={`${slide.title} ${slide.titleHighlight}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover transition-transform duration-[8000ms] ease-out ${
                  index === currentSlide ? "scale-110" : "scale-100"
                }`}
              />
            )}
            <div className="absolute inset-0 bg-black/35" />
          </div>

          {/* Content */}
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
                <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">{slide.subtitle}</p>
                <Link href="#empresa" className="mecsa-btn inline-block">
                  Saber Más
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button onClick={prevSlide} type="button" aria-label="Slide anterior"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-20">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={nextSlide} type="button" aria-label="Siguiente slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-20">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button key={`dot-${index}`} type="button" onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-[var(--mecsa-primary)] scale-125" : "bg-white/50"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
