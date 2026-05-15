"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ScrollAnimations";
import { Check, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { renderInline } from "@/lib/inline-markdown";

interface Product {
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  features: string[];
  image: string;
  gallery: string[];
}

interface ProductDetailClientProps {
  product: Product;
  slug: string;
  allProducts: Record<string, Product>;
}

export default function ProductDetailClient({
  product,
  slug,
  allProducts,
}: ProductDetailClientProps) {
  const t = useTranslations("common");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const otherProducts = Object.entries(allProducts)
    .filter(([key]) => key !== slug)
    .slice(0, 4);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-center z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <FadeIn>
              <nav className="text-white/70 text-sm mb-4 flex items-center gap-2">
                <Link href="/" className="hover:text-white transition-colors">
                  {t("home")}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/#productos" className="hover:text-white transition-colors">
                  {t("products")}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{product.title}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
                {product.title}
              </h1>
              <p className="text-xl text-white/80 max-w-2xl">{renderInline(product.subtitle)}</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <FadeIn direction="left">
              <div>
                <h2 className="mecsa-section-title mb-6">{t("description")}</h2>
                <p className="text-[var(--mecsa-text-light)] mb-6 leading-relaxed">
                  {renderInline(product.description)}
                </p>
                <div className="prose prose-gray max-w-none">
                  {product.longDescription.split("\n\n").map((paragraph, index) => (
                    <p
                      key={`para-${index}`}
                      className="text-[var(--mecsa-text-light)] mb-4 leading-relaxed whitespace-pre-line"
                    >
                      {renderInline(paragraph)}
                    </p>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div>
                <h2 className="mecsa-section-title mb-6">{t("features")}</h2>
                <StaggerChildren staggerDelay={0.1}>
                  <ul className="space-y-4">
                    {product.features.map((feature, index) => (
                      <StaggerItem key={`feature-${index}`}>
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[var(--mecsa-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[var(--mecsa-text)]">{feature}</span>
                        </li>
                      </StaggerItem>
                    ))}
                  </ul>
                </StaggerChildren>

                <div className="mt-8">
                  <Link href="/cotizar" className="mecsa-btn inline-block">
                    {t("requestQuote")}
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="mecsa-section-title text-center mb-12">{t("gallery")}</h2>
          </FadeIn>
          <StaggerChildren className="grid md:grid-cols-3 gap-6" staggerDelay={0.15}>
            {product.gallery.map((image, index) => (
              <StaggerItem key={`gallery-${index}`}>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentImage(index);
                    setLightboxOpen(true);
                  }}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group w-full"
                >
                  <img
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                </button>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="mecsa-section-title text-center mb-12">{t("otherProducts")}</h2>
          </FadeIn>
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {otherProducts.map(([productSlug, otherProduct]) => (
              <StaggerItem key={productSlug}>
                <Link
                  href={`/productos/${productSlug}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={otherProduct.image}
                      alt={otherProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[var(--mecsa-text)] group-hover:text-[var(--mecsa-primary)] transition-colors">
                      {otherProduct.title}
                    </h3>
                    <p className="text-sm text-[var(--mecsa-text-light)] mt-1 line-clamp-2">
                      {renderInline(otherProduct.description)}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label={t("close")}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
            <img
              src={product.gallery[currentImage]}
              alt={`${product.title} - ${currentImage + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {currentImage + 1} / {product.gallery.length}
          </div>
        </div>
      )}
    </div>
  );
}
