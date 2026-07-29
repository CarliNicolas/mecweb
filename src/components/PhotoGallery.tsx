"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations } from "next-intl";

const defaultGalleryImages = [
  { src: "/images/gallery1.jpeg", alt: "Sistema de refrigeración industrial" },
  { src: "/images/gallery2.jpeg", alt: "Fábrica EMECSA" },
  { src: "/images/gallery3.jpeg", alt: "Filtración de aire" },
  { src: "/images/gallery4.jpeg", alt: "Climatización para particulares" },
  { src: "/images/gallery5.jpeg", alt: "Enfriadores evaporativos" },
  { src: "/images/gallery6.jpeg", alt: "Climatización en edificios" },
  { src: "/images/gallery7.jpeg", alt: "Cámaras de frío" },
  { src: "/images/gallery8.jpeg", alt: "Sistemas de refrigeración" },
];

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function PhotoGallery() {
  const { content } = useSiteContent();
  const gallery = content.gallery;
  const t = useTranslations("gallery");
  const galleryImages = gallery.images.length > 0 ? gallery.images : defaultGalleryImages;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const nextImage = useCallback(
    () => setCurrentImage((prev) => (prev + 1) % galleryImages.length),
    [galleryImages.length]
  );
  const prevImage = useCallback(
    () => setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length),
    [galleryImages.length]
  );

  const openLightbox = (index: number) => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  // Keyboard: Esc close, arrow keys navigate, focus trap
  useEffect(() => {
    if (!lightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      } else if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  return (
    <section id="galeria" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <button
              type="button"
              key={`${image.src}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mecsa-primary)]"
              onClick={() => openLightbox(index)}
              aria-label={`Abrir imagen ${index + 1}: ${image.alt || "Proyecto MEC"}`}
            >
              {isExternal(image.src) ? (
                <img src={image.src} alt={image.alt || "Proyecto MEC"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <Image src={image.src} alt={image.alt || "Proyecto MEC"} fill sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <Link href="/productos/enfriadores-evaporativos" className="mecsa-btn inline-block">
            {gallery.buttonProjects || t("viewProjects")}
          </Link>
          <Link href="/noticias" className="mecsa-btn-outline inline-block">
            {gallery.buttonNews || t("viewNews")}
          </Link>
        </div>
      </div>

      {lightboxOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ${currentImage + 1} de ${galleryImages.length}: ${galleryImages[currentImage].alt || "Proyecto MEC"}`}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button ref={closeBtnRef} type="button" onClick={closeLightbox} aria-label={t("close")}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 w-11 h-11 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white">
            <X className="w-8 h-8" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label={t("prev")}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 w-11 h-11 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white">
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label={t("next")}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 w-11 h-11 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white">
            <ChevronRight className="w-10 h-10" />
          </button>
          <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}>
            {isExternal(galleryImages[currentImage].src) ? (
              <img src={galleryImages[currentImage].src} alt={galleryImages[currentImage].alt || "Proyecto MEC"}
                className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            ) : (
              <div className="relative w-full h-[80vh]">
                <Image src={galleryImages[currentImage].src} alt={galleryImages[currentImage].alt || "Proyecto MEC"}
                  fill sizes="90vw" className="object-contain" />
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentImage + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
