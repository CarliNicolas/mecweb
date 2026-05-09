"use client";

import { useState } from "react";
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

  const openLightbox = (index: number) => { setCurrentImage(index); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <section id="galeria" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <button
              type="button"
              key={`${image.src}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              {isExternal(image.src) ? (
                <img src={image.src} alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 50vw, 25vw"
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
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}>
          <button type="button" onClick={closeLightbox} aria-label={t("close")}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10">
            <X className="w-8 h-8" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label={t("prev")}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10">
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label={t("next")}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10">
            <ChevronRight className="w-10 h-10" />
          </button>
          <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}>
            {isExternal(galleryImages[currentImage].src) ? (
              <img src={galleryImages[currentImage].src} alt={galleryImages[currentImage].alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            ) : (
              <div className="relative w-full h-[80vh]">
                <Image src={galleryImages[currentImage].src} alt={galleryImages[currentImage].alt}
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
