"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";

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
  const reduceMotion = useReducedMotion();
  // Dirección del último cambio: la foto nueva entra por el lado hacia donde fue el gesto
  const [direction, setDirection] = useState(0);
  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);
  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Al soltar: se proyecta la inercia del gesto (como el scroll de iOS) y con eso
  // se decide si pasar de foto o volver; el resorte sale con la velocidad del dedo.
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const decel = 0.998;
    const projected = info.offset.x + ((info.velocity.x / 1000) * decel) / (1 - decel);
    if (projected < -120) nextImage();
    else if (projected > 120) prevImage();
  };
  const slide = reduceMotion ? 0 : 60;
  const spring = { type: "spring" as const, bounce: 0, duration: 0.4 };

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

      <AnimatePresence>
      {lightboxOpen && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ${currentImage + 1} de ${galleryImages.length}: ${galleryImages[currentImage].alt || "Proyecto MEC"}`}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button ref={closeBtnRef} type="button" onClick={closeLightbox} aria-label={t("close")}
            className="press absolute top-4 right-4 text-white hover:text-gray-300 z-10 w-11 h-11 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white">
            <X className="w-8 h-8" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label={t("prev")}
            className="press absolute left-4 text-white hover:text-gray-300 z-10 w-11 h-11 hidden sm:flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white">
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label={t("next")}
            className="press absolute right-4 text-white hover:text-gray-300 z-10 w-11 h-11 hidden sm:flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white">
            <ChevronRight className="w-10 h-10" />
          </button>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentImage}
              custom={direction}
              className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
              // Arrastre 1:1 con el dedo; elástico (rubber-band) si no hay a dónde ir
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
              onDragEnd={onDragEnd}
              initial={{ opacity: 0, x: direction * slide }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * slide }}
              transition={spring}
            >
              {isExternal(galleryImages[currentImage].src) ? (
                <img src={galleryImages[currentImage].src} alt={galleryImages[currentImage].alt || "Proyecto MEC"}
                  draggable={false} className="max-w-full max-h-[80vh] object-contain rounded-lg select-none" />
              ) : (
                <div className="relative w-full h-[80vh]">
                  <Image src={galleryImages[currentImage].src} alt={galleryImages[currentImage].alt || "Proyecto MEC"}
                    draggable={false} fill sizes="90vw" className="object-contain select-none" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm" aria-live="polite">
            {currentImage + 1} / {galleryImages.length}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
}
